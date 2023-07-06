import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DisciplineCouncil} from './discipline-council.model';
import {Observable} from 'rxjs';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DisciplineCouncilService} from './discipline-council.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DialogService} from 'primeng/dynamicdialog';
import {
  SelectDisciplineReportsDialogComponent
} from './select-discipline-reports/select-discipline-reports-dialog.component';
import {DisciplineOffenseService} from '../discipline-offense/discipline-offense.service';
import {DiscCouncilOffense} from '../disc-council-offense/disc-council-offense.model';
import {
  DisciplineCouncilInmateApologyDialogComponent
} from './inmate-apology/discipline-council-inmate-apology-dialog.component';
import {DiscCouncilOffenseService} from '../disc-council-offense/disc-council-offense.service';
import {DisciplineDecision} from '../discipline-decision/discipline-decision.model';
import {DisciplineOffense} from '../discipline-offense/discipline-offense.model';
import {
  DisciplineDecisionViewDialogComponent
} from '../discipline-decision/discipline-decision-view-dialog/discipline-decision-view-dialog.component';
import {DisciplineDecisionService} from '../discipline-decision/discipline-decision.service';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {DisciplineService} from '../discipline/discipline.service';


@Component({
  selector: 'app-inm-discipline-council-view',
  templateUrl: 'discipline-council-view.component.html'
})

export class DisciplineCouncilViewComponent implements OnInit{
  
  id: number;
  disciplineCouncil: DisciplineCouncil;
  @ViewChild(NgForm) disciplineCouncilForm: NgForm;
  viewLink = '/inm/disciplinecouncil/view';
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  selectedDisciplineReports = [];
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  selectedDiscCouncilOffenses: DiscCouncilOffense[] = [];

  // ---------------------------------------------------------------------------------------------------------------------------------------
  disciplineDecision: DisciplineDecision;
  selectedDisciplineDecisions: DisciplineDecision[] = [];

  // ---------------------------------------------------------------------------------------------------------------------------------------
  disciplinesOfDisciplineCouncil = [];
  disciplineViewLink = '/inm/discipline/view';



  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private disciplineCouncilService: DisciplineCouncilService,
    private disciplineOffenseService: DisciplineOffenseService,
    private discCouncilOffenseService: DiscCouncilOffenseService,
    private disciplineDecisionService: DisciplineDecisionService,
    private dialogService: DialogService,
    private disciplineService: DisciplineService
    

) {
  }
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.disciplineCouncil = this.id ? this.route.snapshot.data['record'] : new DisciplineCouncil();
    
    // Ανάκτηση των πειθαρχικών ενός συμβουλίου πειθαρχικών. Πρόκειται για τα πειθαρχικά που δημιουργήθηκαν απο τις αποφάσεις πειθαρχικών του συμβουλίου πειθαρχικών.
    this.disciplineService.getDisciplinesOfDisciplineCouncil(this.disciplineCouncil.id).subscribe(response => {
        this.disciplinesOfDisciplineCouncil = response;
    });
    
    console.log(this.disciplineCouncil);

  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.disciplineCouncilForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/disciplinecouncil/view']);
  }

  goToList() {
    this.router.navigate(['/inm/disciplinecouncil/list']);
  }
  
  addDisciplineReports() {
    this.openSelectDisciplineReportsDialog();
  }

  
  // ΣΥΜΒΟΥΛΙΑ ΠΕΙΘΑΡΧΙΚΩΝ ---------------------------------------------------------------------------------------------------------------------------------------
  
  
   // Αποθήκευση 
  saveDisciplineCouncil() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineCouncilService.saveDisciplineCouncil(this.disciplineCouncil).subscribe({
      next: (responseData: DisciplineCouncil) => {
        this.toitsuToasterService.showSuccessStay();
        this.disciplineCouncilForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/disciplinecouncil/view', responseData.id]);
        }
        else {
          this.disciplineCouncil = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
   // Διαγραφή
  deleteDisciplineCouncil() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.disciplineCouncilService.deleteDisciplineCouncil(this.disciplineCouncil.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.disciplineCouncilForm.form.markAsPristine();
            this.router.navigate(['/inm/disciplinecouncil/list']);
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }
  
  // Ολοκλήρωση
  completeDisciplineCouncil() {

    this.confirmationService.confirm({
      message: this.translate.instant('disciplineCouncil.completeDisciplineCouncil.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.disciplineCouncilService.completeDisciplineCouncil(this.disciplineCouncil.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('disciplineCouncil.completeDisciplineCouncil.success'));

            // Ανανέωση σελίδας για ενημέρωση πεδίων σελίδας
            this.router.navigate(['/']).then(() => {
              this.router.navigate(['/inm/disciplinecouncil/view', this.disciplineCouncil.id]);
            });
            this.toitsuNavService.onMenuStateChange('0');

          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
    
  }

  // Άνοιγμα dialog για επιλογή αναφορών πειθαρχικού
  openSelectDisciplineReportsDialog() {

    this.toitsuToasterService.clearMessages();
    const selectDisciplineReportsDialog = this.dialogService.open(SelectDisciplineReportsDialogComponent, {
      header: this.translate.instant('disciplineCouncil.selectDisciplineReports.dialogTitle'),
      width: '60%'
    });

    selectDisciplineReportsDialog.onClose.subscribe(result => {
      this.selectedDisciplineReports = [];
      if (result) {
        this.selectedDisciplineReports = result;
        this.addDisciplineOffensesOfDisciplineReportsToDisciplineOffensesTable(this.selectedDisciplineReports);
      }
    });

  }
  
  // ΣΥΜΒΟΥΛΙΑ ΠΕΙΘΑΡΧΙΚΩΝ ---------------------------------------------------------------------------------------------------------------------------------------

  
  // ΑΝΑΦΕΡΟΜΕΝΟΙ ---------------------------------------------------------------------------------------------------------------------------------------
  
  
  // Εισαγωγή πειθαρχικών παραπτωμάτων των αναφορών πειθαρχικού στον πίνακα (p-table) "Αναφερόμενοι"
  addDisciplineOffensesOfDisciplineReportsToDisciplineOffensesTable(selectedDisciplineReports) {

    let selectedDisciplineReportsIds: any = [];
    
    // Βρίσκω τα ids των επιλεγμένων αναφορών πειθαρχικού 
    selectedDisciplineReportsIds = selectedDisciplineReports.map(selectedDisciplineReport => selectedDisciplineReport.id);
    
    // Καλώ την μέθοδο εύρεσης πειθαρχικών παραπτωμάτων των αναφορών πειθαρχικού
    this.disciplineOffenseService.getDisciplineOffensesOfDisciplineReportsForDisciplineCouncil(selectedDisciplineReportsIds).subscribe(response => {

      let selectedDisciplineOffensesOfDisciplineReports: any = [];

      // Εισάγω τα αποτελέσματα της μεθόδου εύρεσης πειθαρχικών παραπτωμάτων των αναφορών πειθαρχικού στον πίνακα επιλεγμένων πειθαρχικών παραπτωμάτων αναφορών πειθαρχικού 
      selectedDisciplineOffensesOfDisciplineReports = response;
      
      // Διατρέχω τον πίνακα επιλεγμένων πειθαρχικών παραπτωμάτων αναφορών πειθαρχικού για κάθε ένα πειθαρχικό παράπτωμα
      selectedDisciplineOffensesOfDisciplineReports.forEach(disciplineOffense => {
        // Δηλώνω μια νέα μεταβλητή τύπου πειθαρχικού παραπτώματος αναφοράς πειθαρχικού (ενδιάμεσος πίνακας)
        let discCouncilOffense = new DiscCouncilOffense();
        // Εισάγω το αντικείμενο πειθαρχικού παραπτώματος στο πεδίο πειθαρχικό παράπτωμα του ενδιάμεσου πίνακα
        discCouncilOffense.disciplineOffense = disciplineOffense;
        // Εισάγω το id του αντικειμένου του πειθαρχικού παραπτώματος στο πεδίο id πειθαρχικού παραπτώματος του ενδιάμεσου πίνακα
        discCouncilOffense.disciplineOffenseId = disciplineOffense.id;
        
        // Βρίσκω τις φορές που υπάρχει το πειθαρχικό παράπτωμα 
        let discCouncilOffenses = this.disciplineCouncil.discCouncilOffenses.filter(disciplineCouncilOffense => disciplineCouncilOffense.disciplineOffenseId === discCouncilOffense.disciplineOffenseId);

        // Έλεγχος αν υπάρχει ήδη το πειθαρχικό παράπτωμα στον ενδιάμεσο πίνακα
        if (discCouncilOffense.disciplineOffenseId && discCouncilOffenses.length === 0) {
          // Εισάγω την μεταβλητή στην λίστα πειθαρχικών παραπτωμάτων πειθαρχικού συμβουλίου του πίνακα πειθαρχικού συμβουλίου
          this.disciplineCouncil.discCouncilOffenses.push(discCouncilOffense);
        }
        
      });
      // Refresh του πίνακα για να εμφανίζονται οι εγγραφές στο p-table
      this.disciplineCouncil.discCouncilOffenses = [...this.disciplineCouncil.discCouncilOffenses];
    });
    
  }

  // Άνοιγμα dialog για απολογία κρατούμενου
  openInmateApologyDialog(index) {
    
    console.log(this.disciplineCouncil);
    
    this.toitsuToasterService.clearMessages();
    const disciplineCouncilInmateApology = this.dialogService.open(DisciplineCouncilInmateApologyDialogComponent, {
      header: this.translate.instant('disciplineOffense.InmateApology') + ' ' + this.disciplineCouncil.discCouncilOffenses[index].disciplineOffense.inmateFullName,
      width: '40rem',
      height: '25rem',
      data:
        {
          disciplineOffense: this.disciplineCouncil.discCouncilOffenses[index].disciplineOffense,
          disciplineCouncil: this.disciplineCouncil
        },
        closable: false
    });
    disciplineCouncilInmateApology.onClose.subscribe(result => {
      if (result) {
        this.disciplineCouncil.discCouncilOffenses[index].disciplineOffense.apology = result[0];
        if (result[1] === true) {
          this.disciplineCouncilForm.form.markAsDirty();
        }
      }
      
    });
    
  }

  // Φιλτράρισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
  // Τα φιλτραρισμένα επιλεγμένα πειθαρχικά παραπτώματα προορίζονται για νέα αναβολή.
  // Δημιουργήθηκε έτσι ώστε εάν ο χρήστης επιλέξει το κεντρικό checkbox του πίνακα (p-table) "Αναφερόμενοι", να μην επιλέγονται αυτόματα όλες οι εγγραφές του πίνακα (p-table).
  selectedDiscCouncilOffensesForPostponementFiltering(selectedDiscCouncilOffenses) {
    const filteredSelectedDiscCouncilOffenses = selectedDiscCouncilOffenses.filter(selectedDiscCouncilOffense => {
      // Το φιλτράρισμα πραγματοποιείται έτσι ώστε πειθαρχικά παραπτώματα που έχουν:
      // πεδίο "Αναβλήθηκε": Αληθές στον ενδιάμεσο πίνακα, ή
      // πεδίο "Αναβλήθηκε": Ψευδές στον ενδιάμεσο πίνακα & κατάσταση: Αθώος, ή
      // πεδίο "Αναβλήθηκε": Ψευδές στον ενδιάμεσο πίνακα & κατάσταση: Ένοχος
      // να εξαιρούνται από την λίστα των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών.
      if (selectedDiscCouncilOffense.postponed === true
        || (selectedDiscCouncilOffense.postponed === false && selectedDiscCouncilOffense.disciplineOffense.status === 'GUILTY')
        || (selectedDiscCouncilOffense.postponed === false && selectedDiscCouncilOffense.disciplineOffense.status === 'INNOCENT')) {
        return false;
      } else {
        return true;
      }
    });

    // Άδεισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
    selectedDiscCouncilOffenses.splice(0, selectedDiscCouncilOffenses.length);

    // Γέμισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών με τα στοιχεία της φιλτραρισμένης λίστας
    filteredSelectedDiscCouncilOffenses.forEach(filteredSelectedDiscCouncilOffense => {
      selectedDiscCouncilOffenses.push(filteredSelectedDiscCouncilOffense);
    });
  }
  
  // Αναβολή πειθαρχικών παραπτωμάτων
  postponeDisciplineOffenses(selectedDiscCouncilOffenses){

    // Φιλτράρισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
    this.selectedDiscCouncilOffensesForPostponementFiltering(selectedDiscCouncilOffenses);

    // Άν έχουν επιλεχθεί πειθαρχικά παραπτώματα του συμβουλίου πειθαρχικών
    if (selectedDiscCouncilOffenses.length > 0) {

      this.confirmationService.confirm({
        message: this.translate.instant('disciplineCouncil.reported.postponeDisciplineOffensesConfirmation'),
        accept: () => {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.discCouncilOffenseService.postponeDisciplineOffenses(selectedDiscCouncilOffenses).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('disciplineCouncil.reported.postponeDisciplineOffensesSuccess'));
              this.disciplineCouncilForm.form.markAsPristine();

              // Ανάκτηση ενημερωμένων εγγραφών για το p-table "Αναφερόμενοι"
              this.disciplineCouncilService.getDisciplineCouncil(this.id).subscribe({
                next: (responseObject: DisciplineCouncil) => {
                  this.disciplineCouncil = responseObject;
                }

              });

            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
          // Απεπιλογή των checkboxes του p-table "Αναφερόμενοι" για τα πειθαρχικά παραπτώματα που αναβλήθηκαν.
          // Γίνεται με χρήση εκχώρησης ενός κενού πίνακα στον πίνακα των επιλεγμένων γραμμών.
          this.selectedDiscCouncilOffenses = [];
        }
      });

    }
    
    else {
        this.toitsuToasterService.showErrorStay(this.translate.instant('disciplineCouncil.reported.postponeDisciplineOffense.selectDisciplineOffenses'));
      }
    
  }
  
  // Φιλτράρισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
  // Τα φιλτραρισμένα επιλεγμένα πειθαρχικά παραπτώματα προορίζονται για νέα απόφαση πειθαρχικών.
  // Δημιουργήθηκε έτσι ώστε εάν ο χρήστης επιλέξει το κεντρικό checkbox του πίνακα (p-table) "Αναφερόμενοι", να μην επιλέγονται αυτόματα όλες οι εγγραφές του πίνακα (p-table).
  selectedDiscCouncilOffensesForNewDisciplineDecisionFiltering(selectedDiscCouncilOffenses) {
    
    const filteredSelectedDiscCouncilOffenses = selectedDiscCouncilOffenses.filter(selectedDiscCouncilOffense => {
      // Το φιλτράρισμα πραγματοποιείται έτσι ώστε πειθαρχικά παραπτώματα που έχουν:
      // πεδίο "Αναβλήθηκε": Αληθές στον ενδιάμεσο πίνακα, ή
      // πεδίο "Αναβλήθηκε": Ψευδές στον ενδιάμεσο πίνακα & κατάσταση: Αθώος, ή
      // πεδίο "Αναβλήθηκε": Ψευδές στον ενδιάμεσο πίνακα & κατάσταση: Ένοχος
      // να εξαιρούνται από την λίστα των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών.
      if (selectedDiscCouncilOffense.postponed === true
            || (selectedDiscCouncilOffense.postponed === false && selectedDiscCouncilOffense.disciplineOffense.status === 'GUILTY')
            || (selectedDiscCouncilOffense.postponed === false && selectedDiscCouncilOffense.disciplineOffense.status === 'INNOCENT')) {
        return false;
      } else { 
        return true;
      }
    });

    // Άδεισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
    selectedDiscCouncilOffenses.splice(0, selectedDiscCouncilOffenses.length);

    // Γέμισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών με τα στοιχεία της φιλτραρισμένης λίστας
    filteredSelectedDiscCouncilOffenses.forEach(filteredSelectedDiscCouncilOffense => {
      selectedDiscCouncilOffenses.push(filteredSelectedDiscCouncilOffense);
    });
    
  }
  
  // Άνοιγμα dialog για νέα απόφαση πειθαρχικών
  openAddDisciplineDecisionDialog(selectedDiscCouncilOffenses) {

    // Φιλτράρισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
    this.selectedDiscCouncilOffensesForNewDisciplineDecisionFiltering(selectedDiscCouncilOffenses);
    
    // Άν έχουν επιλεχθεί πειθαρχικά παραπτώματα του συμβουλίου πειθαρχικών
    if (selectedDiscCouncilOffenses.length > 0) {

      // Δημιουργία απόφασης πειθαρχικών με κενά στοιχεία
      let disciplineDecision: DisciplineDecision = new DisciplineDecision();

      // Λίστα επιλεγμένων πειθαρχικών παραπτωμάτων προς νέα Απόφαση Πειθαρχικών
      let selectedDisciplineOffensesForNewDisciplineDecision: DisciplineOffense[] = [];

      // Γέμισμα της προσωρινής λίστας επιλεγμένων πειθαρχικών παραπτωμάτων με τα πειθαρχικά παραπτώματα της φιλτραρισμένης λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
      selectedDiscCouncilOffenses.forEach(discCouncilOffense => selectedDisciplineOffensesForNewDisciplineDecision.push(discCouncilOffense.disciplineOffense));

      // Id συμβουλίου πειθαρχικών
      let disciplineCouncilId: number = null;

      // Ανάκτηση id συμβουλίου πειθαρχικών
      selectedDiscCouncilOffenses.forEach(selectedDiscCouncilOffense => {
        disciplineCouncilId = selectedDiscCouncilOffense.disciplineCouncilId;
      });

      this.toitsuToasterService.clearMessages();
      const openAddDisciplineDecisionDialog = this.dialogService.open(DisciplineDecisionViewDialogComponent, {
        header: this.translate.instant('disciplineCouncil.addDisciplineDecision.dialogTitle'),
        width: '60%',
        data: {
          disciplineDecision: disciplineDecision,
          // Λίστα με τα επιλεγμένα πειθαρχικά παραπτώματα προς νέα απόφαση πειθαρχικών
          selectedDisciplineOffensesForNewDisciplineDecision: selectedDisciplineOffensesForNewDisciplineDecision,
          // Id συμβουλίου πειθαρχικών
          disciplineCouncilId: disciplineCouncilId,
          disciplineCouncil: this.disciplineCouncil
        },
        closable: false,
      });

      openAddDisciplineDecisionDialog.onClose.subscribe(result => {
        if (result) {
          this.disciplineCouncil.disciplineDecisions = result;
        }
      });

    }

    // Άν δεν έχουν επιλεχθεί πειθαρχικά παραπτώματα του συμβουλίου πειθαρχικών
    else {
      this.toitsuToasterService.showErrorStay(this.translate.instant('disciplineCouncil.addDisciplineDecision.selectDisciplineOffenses'));
    }
    
  }
  
  
  // ΑΝΑΦΕΡΟΜΕΝΟΙ ---------------------------------------------------------------------------------------------------------------------------------------

  
  // ΑΠΟΦΑΣΕΙΣ ---------------------------------------------------------------------------------------------------------------------------------------
  
  
  // Άνοιγμα dialog για επεξεργασία υπάρχουσας Απόφασης Πειθαρχικών
  openEditDisciplineDecisionDialog(index) {

    this.toitsuToasterService.clearMessages();
    const openEditDisciplineDecisionDialog = this.dialogService.open(DisciplineDecisionViewDialogComponent, {
      header: this.translate.instant('disciplineCouncil.editDisciplineDecision.dialogTitle'),
      width: '60%',
      data: {
        disciplineDecision: this.disciplineCouncil.disciplineDecisions[index],
        disciplineCouncil: this.disciplineCouncil,
      },
      closable: false,
    });
    openEditDisciplineDecisionDialog.onClose.subscribe(result => {
      if (result) {
        this.disciplineCouncil.disciplineDecisions[index] = new DisciplineDecision();
        this.disciplineCouncil.disciplineDecisions[index] = result;
      }
    });

  }
  
  // Διαγραφή Απόφασης Πειθαρχικών
  deleteDisciplineDecision(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.disciplineCouncil.disciplineDecisions.splice(index, 1);
          this.changeDetectorRef.detectChanges();
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.disciplineDecisionService.deleteDisciplineDecision(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.disciplineCouncil.disciplineDecisions.splice(index, 1);
              this.changeDetectorRef.detectChanges();

              // Ανανέωση σελίδας για ενημέρωση πεδίων των p-table του p-tabView στην σελίδα του συμβουλίου πειθαρχικών
              this.router.navigate(['/']).then(() => {
                this.router.navigate(['/inm/disciplinecouncil/view', this.disciplineCouncil.id]);
              });
              this.toitsuNavService.onMenuStateChange('0');
              
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
            
            
          });
        }
      }
    });
  }

  // Φιλτράρισμα λίστας των επιλεγμένων αποφάσεων πειθαρχικών
  // Οι φιλτραρισμένες επιλεγμένες αποφάσεις πειθαρχικών προορίζονται για νέα δημιουργία πειθαρχικών.
  // Δημιουργήθηκε έτσι ώστε εάν ο χρήστης επιλέξει το κεντρικό checkbox του πίνακα (p-table) "Αποφάσεις", να μην επιλέγονται αυτόματα όλες οι εγγραφές του πίνακα (p-table).
  selectedDisciplineDecisionsFiltering(selectedDisciplineDecisions) {

    const filteredSelectedDisciplineDecisions = selectedDisciplineDecisions.filter(selectedDisciplineDecision => {

      // Αριθμός πειθαρχικών παραπτωμάτων της επιλεγμένης απόφασης πειθαρχικών τα οποία δεν έχουν πειθαρχικό
      let disciplineOffensesOfSelectedDisciplineDecisionWithoutDisciplineCount = 0;
      
      // Για κάθε πειθαρχικό παράπτωμα της επιλεγμένης απόφασης πειθαρχικών
      selectedDisciplineDecision.disciplineOffenses.forEach(disciplineOffense => {
        
        // Άν το πειθαρχικό παράπτωμα δεν έχει πειθαρχικό
        if (disciplineOffense.disciplineId == null) {
          // Αύξηση του αριθμού πειθαρχικών παραπτωμάτων της επιλεγμένης απόφασης πειθαρχικών τα οποία δεν έχουν πειθαρχικό κατά 1
          disciplineOffensesOfSelectedDisciplineDecisionWithoutDisciplineCount += 1;
        }
        
      });

      // Το φιλτράρισμα πραγματοποιείται έτσι ώστε μόνο οι αποφάσεις πειθαρχικών, των οποίων όλα τα πειθαρχικά παραπτώματα δεν έχουν πειθαρχικό,
      // να συμπεριλαμβάνονται την λίστα των αποφάσεων πειθαρχικών που προορίζεται για νέα δημιουργία πειθαρχικών.
      if (disciplineOffensesOfSelectedDisciplineDecisionWithoutDisciplineCount === selectedDisciplineDecision.disciplineOffenses.length) {
        return true;
      } else {
        return false;
      }
      
    });
    
    // Άδεισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών
    selectedDisciplineDecisions.splice(0, selectedDisciplineDecisions.length);
    
    // Γέμισμα λίστας των επιλεγμένων πειθαρχικών παραπτωμάτων του συμβουλίου πειθαρχικών με τα στοιχεία της φιλτραρισμένης λίστας
    filteredSelectedDisciplineDecisions.forEach(filteredSelectedDisciplineDecision => {
      selectedDisciplineDecisions.push(filteredSelectedDisciplineDecision);
    });
    
  }
  
  // Μέθοδος εμφάνισης / απόκρυψης checkbox απόφασης πειθαρχικών στον πίνακα (p-table) "Αποφάσεις".
  showDisciplineDecisionOnDisciplineDecisionsTable(disciplineDecision) {

    // Αριθμός πειθαρχικών παραπτωμάτων της απόφασης πειθαρχικών τα οποία δεν έχουν πειθαρχικό
    let disciplineOffensesOfDisciplineDecisionWithoutDisciplineCount = 0;

    // Για κάθε πειθαρχικό παράπτωμα της απόφασης πειθαρχικών
    disciplineDecision.disciplineOffenses.forEach(disciplineOffense => {

      // Άν το πειθαρχικό παράπτωμα δεν έχει πειθαρχικό
      if (disciplineOffense.disciplineId == null) {
        // Αύξηση του αριθμού πειθαρχικών παραπτωμάτων της επιλεγμένης απόφασης πειθαρχικών τα οποία δεν έχουν πειθαρχικό κατά 1
        disciplineOffensesOfDisciplineDecisionWithoutDisciplineCount += 1;
      }
      
    });

    // Το φιλτράρισμα πραγματοποιείται έτσι ώστε μόνο οι αποφάσεις πειθαρχικών, των οποίων όλα τα πειθαρχικά παραπτώματα δεν έχουν πειθαρχικό,
    // να συμπεριλαμβάνονται την λίστα των αποφάσεων πειθαρχικών που προορίζεται για νέα δημιουργία πειθαρχικών.
    
    // Εάν όλα τα πειθαρχικά παραπτώματα της απόφασης πειθαρχικών δεν έχουν πειθαρχικό,
    // το checkbox της απόφασης πειθαρχικών στον πίνακα (p-table) "Αποφάσεις" είναι φανερό 
    if (disciplineOffensesOfDisciplineDecisionWithoutDisciplineCount === disciplineDecision.disciplineOffenses.length) {
      return true;
    } else {
      return false;
    }
    
    
  }
  
  // Δημιουργία Πειθαρχικών από Αποφάσεις Πειθαρχικών
  createDisciplinesFromDisciplineDecisions(selectedDisciplineDecisions) {

    // Φιλτράρισμα λίστας των επιλεγμένων αποφάσεων πειθαρχικών
    this.selectedDisciplineDecisionsFiltering(selectedDisciplineDecisions);
    
    // Άν έχουν επιλεχθεί αποφάσεις πειθαρχικών
    if (selectedDisciplineDecisions.length > 0) {
      
      // Λίστα με τα ids των επιλεγμένων αποφάσεων πειθαρχικών
      const selectedDisciplineDecisionIds: number[] = selectedDisciplineDecisions.map((selectedDisciplineDecision) => selectedDisciplineDecision.id);

      this.confirmationService.confirm({
        message: this.translate.instant('disciplineCouncil.disciplineDecision.createDisciplinesFromDisciplineDecisions.confirmation'),
        accept: () => {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.disciplineService.createDisciplinesFromDisciplineDecisions(selectedDisciplineDecisionIds).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('disciplineCouncil.disciplineDecision.createDisciplinesFromDisciplineDecisions.create.success'));

              // Ανανέωση σελίδας για ενημέρωση πεδίων των p-table του p-tabView στην σελίδα του συμβουλίου πειθαρχικών
              this.router.navigate(['/']).then(() => {
                this.router.navigate(['/inm/disciplinecouncil/view', this.disciplineCouncil.id]);
              });
              this.toitsuNavService.onMenuStateChange('0');

            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      });

      // Άν δεν έχουν επιλεχθεί αποφάσεις πειθαρχικών
    } else {
      this.toitsuToasterService.showErrorStay(this.translate.instant('disciplineCouncil.disciplineDecision.createDisciplinesFromDisciplineDecisions.selectDisciplineDecisions'));
    }
    
  }

  
  // ΑΠΟΦΑΣΕΙΣ ---------------------------------------------------------------------------------------------------------------------------------------

  
  // ΠΕΙΘΑΡΧΙΚΑ ---------------------------------------------------------------------------------------------------------------------------------------

  
  // Άνοιγμα καρτέλας επιλεγμένου πειθαρχικού
  openDisciplineViewLink(discipline) {
    const url = this.disciplineViewLink + '/' + discipline.id;
    window.open(url, '_blank');
  }
  
  
  // ΠΕΙΘΑΡΧΙΚΑ ---------------------------------------------------------------------------------------------------------------------------------------
  
}
