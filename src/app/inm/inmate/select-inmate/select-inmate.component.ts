import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {InmateService} from '../inmate.service';
import {InmateListDialogComponent} from '../inmate-list-dialog/inmate-list-dialog.component';
import {Inmate} from '../inmate.model';
import {inmateConsts} from '../inmate.consts';
import {InmatePhotoService} from '../../inmate-photo/inmate-photo.service';

@Component({
  selector: 'app-select-inmate',
  templateUrl: 'select-inmate.component.html'
})
export class SelectInmateComponent implements OnInit, OnChanges {
  
  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();
  
  @Input() name: string;
  @Input() disabled = false;
  
  @Input() inmates = [];
  @Input() loadOnOpen = false;
  @Input() dialogUrl: string;
  
  loadedInmate: Inmate;
  listLoading = false;
  listLoaded = false;
  
  showDropdown = true;
  
  constructor(
    private elementRef: ElementRef,
    private translate: TranslateService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private inmateService: InmateService,
    public inmatePhotoService: InmatePhotoService
  ) {
  }
  
  ngOnInit() {
    // -----Περίπτωση φόρτωσης κρατουμένων στο άνοιγμα του dropdown----
    // Αν έχει δοθεί id κρατουμένου
    if (this.loadOnOpen && this.model) {
      // Ανάκτηση του κρατουμένου
      this.inmateService.getInmateMini(this.model).subscribe({
        next: (responseData: Inmate) => {
          if (responseData) {
            // Αρχικοποίηση της λίστας ώστε να έχει μόνο τον φορτωμένο κρατούμενο
            this.inmates = [responseData];
            
            // Κρατάμε τον κρατούμενο σε μια μεταβλητή για να τον ξαναβάλουμε όταν γίνει η κλήση για να φορτωθεί η λίστα
            this.loadedInmate = responseData;
          }
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      });
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // -----Περίπτωση που η λίστα κρατουμένων δίνεται απ' έξω ως παράμετρος----
    // Όταν ολοκληρωθεί η φόρτωση της λίστας κρατουμένων, αν έχει δοθεί id κρατουμένου
    if (!this.loadOnOpen && changes.inmates && this.inmates && this.inmates.length && this.model) {
      
      // Έλεγχος αν ο κρατούμενος με αυτό το id υπάρχει στη λίστα
      let filteredInmates = this.inmates.filter(item => item['id'] === this.model);
      
      // Αν ο κρατούμενος δεν υπάρχει στη λίστα
      if (!filteredInmates || filteredInmates.length === 0) {
        
        // Προσωρινή απόκρυψη του dropdown κρατουμένων
        this.showDropdown = false;
        
        // Ανάκτηση του κρατουμένου
        this.inmateService.getInmateMini(this.model).subscribe({
          next: (responseData: Inmate) => {
            if (responseData) {
              // Προσθήκη του κρατουμένου στη λίστα
              this.inmates.push(responseData);
            }
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          // Επανεμφάνιση του dropdown όταν επιστρέψει η κλήση
          this.showDropdown = true;
        });
      }
    }
  }

  emitModelChange() {
    this.modelChange.emit(this.model);
  }
  
  openDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(InmateListDialogComponent, {
      header: this.translate.instant('inmate.select.dialogTitle'),
      width: '95%',
      data: {
        dialogUrl: this.dialogUrl
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      this.model = result;
      this.emitModelChange();
    });
  }
  
  removeRecord() {
    this.model = null;
    this.emitModelChange();
  }
  
  getInmateFullName() {
    if (!this.model) {
      return null;
    }
    else {
      let filteredInmates = this.inmates.filter(item => item['id'] === this.model);
      if (filteredInmates && filteredInmates[0]) {
        return filteredInmates[0]['fullName'];
      }
      return null;
    }
  }
  
  dropdownClicked() {
    if (this.loadOnOpen && !this.listLoaded) {
      // -----Περίπτωση φόρτωσης κρατουμένων στο άνοιγμα του dropdown----
      // Αν δεν έχει ήδη γίνει η φόρτωση της λίστας
      // Χρησιμοποιούμε το dialogUrl για να προσδιορίσουμε ποια μέθοδο θα καλέσουμε
      if (this.dialogUrl === inmateConsts.activeIndexUrl) {
        // Active inmates
        this.listLoading = true;
        this.inmateService.getActiveInmates().subscribe(responseData => {
          this.addIfNotExistsLoadedInmateToList(responseData);
          this.inmates = responseData;
          this.fixDropdownOptionsWidth();
          this.listLoaded = true;
        }).add(() => {
          this.listLoading = false;
        });
      }
      else if (this.dialogUrl === inmateConsts.lastRecordIndexUrl) {
        // Last record inmates
        this.listLoading = true;
        this.inmateService.getLastRecordInmates().subscribe(responseData => {
          this.addIfNotExistsLoadedInmateToList(responseData);
          this.inmates = responseData;
          this.fixDropdownOptionsWidth();
          this.listLoaded = true;
        }).add(() => {
          this.listLoading = false;
        });
      }
    }
    else {
      // -----Περίπτωση που η λίστα κρατουμένων δίνεται απ' έξω ως παράμετρος----
      this.fixDropdownOptionsWidth();
    }
  }
  
  addIfNotExistsLoadedInmateToList(responseData) {
    // Αν υπήρχε φορτωμένος κρατούμενος, έλεγχος αν η εγγραφή με αυτό το id υπάρχει στη λίστα που φορτώθηκε.
    // Αν δεν υπάρχει, προστίθεται.
    if (this.loadedInmate && this.loadedInmate.id) {
      let filteredInmates = responseData.filter(item => item['id'] === this.loadedInmate.id);
      if (!filteredInmates || filteredInmates.length === 0) {
        responseData.push(this.loadedInmate);
      }
    }
  }
  
  fixDropdownOptionsWidth() {
    // Παίρνουμε το width του dropdown και το εφαρμόζουμε στο container των options.
    // Βρίσκουμε το container των options με javascript και όχι μέσω του elementRef.nativeElement
    // επειδή το appendTo="body" το τοποθετεί εκτός του dropdown.
    // (Το appendTo="body" είναι απαραίτητο)
    setTimeout(() => {
      let dropdownElement = this.elementRef.nativeElement.querySelector('p-dropdown');
      if (dropdownElement) {
        let width = dropdownElement.offsetWidth;
        let dropdownItemsWrapperElements = document.getElementsByClassName('p-dropdown-items-wrapper');
        dropdownItemsWrapperElements[0]['style'].width = width + 'px';
      }
    });
  }
}
