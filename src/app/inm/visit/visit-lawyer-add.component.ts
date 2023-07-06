import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {DateService} from '../../toitsu-shared/date.service';
import {VisitTypeService} from '../../sa/visit-type/visit-type.service';
import {VisitorService} from '../visitor/visitor.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {VisitVisitorService} from '../visit-visitor/visit-visitor.service';
import {DialogService} from 'primeng/dynamicdialog';
import {Visit} from './visit.model';
import {VisitService} from './visit.service';
import {GateMovementTypeService} from '../../sa/gate-movement-type/gate-movement-type.service';
import {VisitVisitor} from '../visit-visitor/visit-visitor.model';
import {InmateListDialogComponent} from '../inmate/inmate-list-dialog/inmate-list-dialog.component';
import {VisitLawyerAdd} from './visit-lawyer-add.model';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';

@Component({
  selector: 'app-inm-visit-lawyer-add',
  templateUrl: 'visit-lawyer-add.component.html'
})
export class VisitLawyerAddComponent implements OnInit, ExitConfirmation {

  viewLink = '/inm/visit/lawyeradd';
  
  // URL για ανάκτηση κρατουμένων και πίνακας ενεργών κρατουμένων
  dialogUrl: string;
  inmates = [];

  // Πίνακες διάφορων drop down φόρμας επισκέπτη, στοιχείων κίνησης εισόδου και στοιχείων επισκεπτηρίου
  lawyerVisitors = [];
  gateMovementTypes = [];
  lawyerVisitTypes = [];
  
  // Πίνακας drop down ενεργών κρατουμένων με τους οποίους είχε συσχέτιση ο επισκέπτης-δικηγόρος
  lawyerVisitorInmates = [];
  
  // Πίνακας drop down με τον ενεργό κρατούμενο που δεν έχει συσχέτιση ο επισκέπτης-δικηγόρος
  lawyerVisitorOtherInmates = [];
  
  
  lawyerVisits = [];
  
  selectedLawyerVisitorId;
  visitTypeId;
  gateMovementCreation = false;
  gateMovementTypeId;
  visitDate;
  comments;

  displayedGateMovementTypes = [];
  selectedVisitorInmateLawyersInmatesIds;

  // Πίνακας boolean της κάθε γραμμής νέου επισκεπτηρίου  που δείχνει αν είναι Άλλος κρατούμενος
  isInmateFromOtherInmates = [];
  activeIndex = -1;
  @ViewChild(NgForm) visitForm: NgForm;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private dateService: DateService,
    private visitService: VisitService,
    private visitTypeService: VisitTypeService,
    private gateMovementTypeService: GateMovementTypeService,
    private visitVisitorService: VisitVisitorService,
    private visitorService: VisitorService,
    private inmateService: InmateService
  ) {
  }

  ngOnInit() {
    
    this.visitDate = this.dateService.getCurrentDateTimeString() as unknown as Date;

    this.lawyerVisits = [];

    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.dialogUrl = inmateConsts.activeIndexUrl;

    // GateMovementTypes
    this.gateMovementTypeService.getAllGateMovementTypes().subscribe(response => {
      this.gateMovementTypes = response;
      this.gateMovementTypes = this.gateMovementTypes.filter(gateMovementType => gateMovementType.movementKind === 'VISITOR'); // κρατάω μόνο τους τύπους κίνησης επισκέπτη
    });

    // VisitTypes
    this.visitTypeService.getAllVisitTypes().subscribe({
      next: (responseData) => {
        if (responseData) {
          let visitTypes = responseData;
          this.lawyerVisitTypes = visitTypes.filter(visitType => visitType['kind'] === 'LAWYER'); // κρατάω μόνο τους τύπους επισκεπτηρίου δικηγόρου
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.visitForm.dirty;
  }
  
  goToList() {
    this.router.navigate(['/inm/visit/list']);
  }

  
  lawyeredVisitorIdChanged(visitorId: any) {

    if (visitorId) {
      this.visitorService.getInmateIdsByVisitorId(visitorId).subscribe({
        next: (responseData) => {
          if (responseData) {
            this.selectedVisitorInmateLawyersInmatesIds = responseData;

            this.lawyerVisitorInmates = this.inmates.filter(inmate =>
              this.inmateExistsInInmateLawyersIds(inmate.id, this.selectedVisitorInmateLawyersInmatesIds));
          }
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      });
    } else {
      this.clearLawyerVisits();
    }
  }

  clearLawyerVisits() {
    this.lawyerVisits = [];
    this.activeIndex = -1;
    this.isInmateFromOtherInmates = [];
  }
  saveLawyerVisits() {
    
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    // Εισαγωγή των στοιχείων όλων των επισκεπτηρίων. Όλα τα επισκεπτηρία του δικηγόρου έχουν τα ίδια στοιχεία
    this.lawyerVisits.forEach(lawyerVisit => {
      
      if (this.selectedLawyerVisitorId) {
        lawyerVisit.visitVisitors[0].visitorId = this.selectedLawyerVisitorId;
      } else {
        
      }
      
      lawyerVisit.visitTypeId = this.visitTypeId;
      lawyerVisit.visitDate = this.visitDate;
      lawyerVisit.comments = this.comments;
    });

    let lawyerAdd = new VisitLawyerAdd();
    lawyerAdd.visits = this.lawyerVisits;
    
    // let gateMovementTypeId;
    if (this.gateMovementCreation) {
      lawyerAdd.gateMovementTypeId = this.gateMovementTypeId;
    }
    
    if (!this.validateLawyerAdd(lawyerAdd)) {
      return;
    }
    
    this.visitService.lawyerAdd(lawyerAdd).subscribe({
      next: (responseData: Visit) => {
        this.toitsuToasterService.showSuccessStay();
        this.visitForm.form.markAsPristine();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.refreshPage();
      this.toitsuBlockUiService.unblockUi();
    });
  }
  validateLawyerAdd(lawyerAdd: VisitLawyerAdd): boolean {
    if (!this.selectedLawyerVisitorId) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.visitLawyerAdd.save.visitorIdNull'));
      this.toitsuBlockUiService.unblockUi();
      return false;
    }

    if (lawyerAdd.visits.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.visitLawyerAdd.save.emptyLawyerVisitsList'));
      this.toitsuBlockUiService.unblockUi();
      return false;
    }

    if (this.gateMovementCreation && !this.gateMovementTypeId) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.visitLawyerAdd.save.gateMovementMovementTypeIdNull'));
      this.toitsuBlockUiService.unblockUi();
      return false;
    }

    if (!this.visitTypeId) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.visitLawyerAdd.save.visitTypeIdNull'));
      this.toitsuBlockUiService.unblockUi();
      return false;
    }
    
    for (let i = 0; i < lawyerAdd.visits.length; i++) {
      if (!lawyerAdd.visits[i].inmateId) {
        
        let visit = this.translate.instant('error.visitLawyerAdd.save.visit');
        let error = this.translate.instant('error.visitLawyerAdd.save.inmateIdNull');
        
        this.toitsuToasterService.showErrorStay(visit + ' [' + i + '] ' + error);
        this.toitsuBlockUiService.unblockUi();
        return false;
      }
    }
    return true;
  }
  
  addInmateWithLawyerVisitor() {
    
    // Δημιουργία καινουργίας σχέσης επισκεπτηρίου επισκέπτη-δικηγόρο
    let visitVisitor: VisitVisitor = new VisitVisitor();

    // Δημιουργία καινούργιου επισκεπτηρίου και προσθήκη της σχέσης του με τον επιλεγμένο επισκέπτη-δικηγόρο
    let visit = new Visit();
    visit.visitVisitors.push(visitVisitor);

    // Προσθήκη επισκεπτηρίου στην λίστα επισκεπτηρίων προς καταχώριση
    this.lawyerVisits.push(visit);
    
    this.isInmateFromOtherInmates.push(false);
    this.activeIndex++;
    
  }
  refreshPage() {
    this.router.navigate(['/']).then(() => {
      this.router.navigate([this.viewLink]);
    });
    this.toitsuNavService.onMenuStateChange('0');
  }
  addInmateWithNoLawyerVisitor() {
    const dialogRef = this.dialogService.open(InmateListDialogComponent, {
      header: this.translate.instant('inmate.select.dialogTitle'),
      width: '95%',
      data: {
        dialogUrl: this.dialogUrl
      }
    });

    dialogRef.onClose.subscribe((selectedInmateId) => {
      
      if (selectedInmateId) {
        this.lawyerVisitorOtherInmates.push(this.inmates.filter(inmate => inmate.id === selectedInmateId)[0]);

        // Δημιουργία καινουργίας σχέσης επισκεπτηρίου επισκέπτη-δικηγόρο
        let visitVisitor: VisitVisitor = new VisitVisitor();

        // Δημιουργία καινούργιου επισκεπτηρίου και προσθήκη της σχέσης του με τον επιλεγμένο επισκέπτη
        let visit = new Visit();
        visit.visitVisitors.push(visitVisitor);

        // Προσθήκη επισκεπτηρίου στην λίστα επισκεπτηρίων προς καταχώριση
        this.lawyerVisits.push(visit);

        this.isInmateFromOtherInmates.push(true);
        this.activeIndex++;

        this.lawyerVisits[this.activeIndex].inmateId = selectedInmateId; // ορίζω σαν default στο drop down τον επιλεγμένο
      }
    });
  }

  inmateExistsInInmateLawyersIds(inmateId: number, inmateLawyerInmateIds: number[]): boolean {
    return (inmateLawyerInmateIds.filter(inmateLawyerInmateId => inmateLawyerInmateId === inmateId).length > 0);
  }

  deleteVisit(index: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.lawyerVisits.splice(index, 1);
        this.isInmateFromOtherInmates.splice(index, 1);
        this.activeIndex--;
      }
    });
  }

  gateMovementCreationCheckboxChanged(value: any) {
    if (value) { 
      this.displayedGateMovementTypes = this.gateMovementTypes;
    } else {
      this.displayedGateMovementTypes = null;
    }
  }
}
