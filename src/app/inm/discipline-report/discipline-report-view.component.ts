import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DisciplineReport} from './discipline-report.model';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DialogService} from 'primeng/dynamicdialog';
import {DisciplineReportService} from './discipline-report.service';
import {TranslateService} from '@ngx-translate/core';
import {EnumService} from '../../cm/enum/enum.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {DisciplineOffense} from '../discipline-offense/discipline-offense.model';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {DiscReportOffenseService} from '../disc-report-offense/disc-report-offense.service';
import {DisciplineOffenseViewDialogComponent} from '../discipline-offense/discipline-offense-view-dialog/discipline-offense-view-dialog.component';
import {DisciplineOffenseService} from '../discipline-offense/discipline-offense.service';
import {DiscReportOffense} from '../disc-report-offense/disc-report-offense.model';
import {DisplayRelatedDisciplineReportsOfDisciplineOffenseDialogComponent} from '../discipline-offense/discipline-offense-view-dialog/display-related-discipline-reports-of-discipline-offense/display-related-discipline-reports-of-discipline-offense-dialog.component';
import {DiscReportWitness} from '../disc-report-witness/disc-report-witness.model';
import {DiscReportWitnessService} from '../disc-report-witness/disc-report-witness.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {DisciplineCouncilService} from '../discipline-council/discipline-council.service';


@Component({
  selector: 'app-inm-discipline-report-view',
  templateUrl: 'discipline-report-view.component.html'
})

export class DisciplineReportViewComponent implements OnInit {

  id: number;
  disciplineReport: DisciplineReport = new DisciplineReport();
  @ViewChild(NgForm) disciplineReportForm: NgForm;
  reporterTypes = [];
  inmateReporters = [];
  inmateReporterDialogUrl: string;
  relatedDisciplineReportsOfDisciplineOffense = [];
  showRelatedDisciplinesOfDisciplineOffenseButton = [];
  isDisciplineReportViewLoading: boolean = true;
  disciplineReportHasDisciplineOffensesInsideDisciplineCouncils: any;

  // ---------------------------------------------------------------------------------------------------------------------------------------
  disciplineOffenseTypeParams = {};
  // ---------------------------------------------------------------------------------------------------------------------------------------
  @ViewChild(NgForm) discReportWitnessForm: NgForm;
  witnessTypes = [];
  inmateWitnesses = [];
  inmateWitnessDialogUrl: string;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    public dialogService: DialogService,
    private enumService: EnumService,
    private inmateService: InmateService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private discReportOffenseService: DiscReportOffenseService,
    private disciplineOffenseService: DisciplineOffenseService,
    private disciplineReportService: DisciplineReportService,
    private discReportWitnessService: DiscReportWitnessService,
    private disciplineCouncilService: DisciplineCouncilService

  ) {
  }

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.disciplineReport = this.id ? this.route.snapshot.data['record'] : new DisciplineReport();

    console.log(this.disciplineReport.discReportOffenses);


    // ΑΝΑΦΟΡΑ ΠΕΙΘΑΡΧΙΚΟΥ ---------------------------------------------------------------------------------------------------------------------------------------

    this.showRelatedDisciplinesOfDisciplineOffense();

    // ReporterTypes
    this.enumService.getEnumValues('inm.core.enums.DisciplineReporterType').subscribe(responseData => {
      this.reporterTypes = responseData;
    });

    this.inmateService.getActiveInmates().subscribe(responseData => {
      // Inmate Reporters
      this.inmateReporters = responseData;
      // Inmate Witnesses
      this.inmateWitnesses = responseData;

    });
    this.inmateReporterDialogUrl = inmateConsts.activeIndexUrl;
    this.inmateWitnessDialogUrl = inmateConsts.activeIndexUrl;

    // Έλεγχος ύπαρξης πειθαρχικών παραπτωμάτων μιας αναφοράς πειθαρχικών τα οποία έχουν μπει σε συμβούλια πειθαρχικών
    if (this.disciplineReport.id ) {
    this.disciplineCouncilService.disciplineReportHasDisciplineOffensesInsideDisciplineCouncils(this.disciplineReport.id).subscribe(responseData => {
      this.disciplineReportHasDisciplineOffensesInsideDisciplineCouncils = responseData;
    }).add(() => {
      this.isDisciplineReportViewLoading = false;
    });
    }


    // ΠΕΙΘΑΡΧΙΚΑ ΠΑΡΑΠΤΩΜΑΤΑ ---------------------------------------------------------------------------------------------------------------------------------------

    // Offense Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.DisciplineOffense_OffenseType, []).subscribe(responseData => {
      this.disciplineOffenseTypeParams = responseData;
    });

    // ΜΑΡΤΥΡΕΣ ---------------------------------------------------------------------------------------------------------------------------------------

    // WitnessTypes
    this.enumService.getEnumValues('inm.core.enums.DiscReportWitnessType').subscribe(responseData => {
      this.witnessTypes = responseData;
    });
    
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  confirmExit(): boolean | Observable<boolean> {
    return this.disciplineReportForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/disciplinereport/view']);
  }

  goToList() {
    this.router.navigate(['/inm/disciplinereport/list']);

  }

  // Μέθοδος κλειδώματος πεδίων υπό συνθήκη 
  // Ελέγχει αν η αναφορά πειθαρχικών έχει μπει σε συμβούλιο πειθαρχικών.
  // Η συνθήκη είναι αληθής όταν τα πειθαρχικά παραπτώματα της αναφοράς πειθαρχικών (εξαιρουμένων των συνδεδεμέμων παραπτωμάτων από αλλές αναφορές) έχει μπει σε κάποιο συμβούλιο πειθαρχικών.
  lockIfDisciplineReportIsAddedInDisciplineCouncil(): boolean {
    return this.disciplineReportHasDisciplineOffensesInsideDisciplineCouncils;
  }

  // Μέθοδος απόκρυψης πεδίων υπό συνθήκη 
  // Ελέγχει αν η αναφορά πειθαρχικών έχει μπει σε συμβούλιο πειθαρχικών.
  // Η συνθήκη είναι αληθής όταν τα πειθαρχικά παραπτώματα της αναφοράς πειθαρχικών (εξαιρουμένων των συνδεδεμέμων παραπτωμάτων από αλλές αναφορές) έχει μπει σε κάποιο συμβούλιο πειθαρχικών.
  showIfDisciplineReportIsAddedInDisciplineCouncil(): boolean {
    return this.disciplineReportHasDisciplineOffensesInsideDisciplineCouncils;
  }
  
  


  // ΑΝΑΦΟΡΑ ΠΕΙΘΑΡΧΙΚΟΥ ---------------------------------------------------------------------------------------------------------------------------------------

  // Εμφάνιση/Απόκρυψη κουμπιού 'Συνδεδεμένες Αναφορές Πειθαρχικού'
  showRelatedDisciplinesOfDisciplineOffense() {
    for (let i = 0; i < this.disciplineReport.discReportOffenses.length; i++) {
      if (this.disciplineReport.discReportOffenses[i].relatedDisciplineReportsOfDisciplineOffense.length < 1) {
        this.showRelatedDisciplinesOfDisciplineOffenseButton[i] = false;
      } else {
        this.showRelatedDisciplinesOfDisciplineOffenseButton[i] = true;
      }

    }
  }

  // Αλλαγή ονόματος και επωνύμου αναφέροντος
  reporterFirstAndLastNameChanged() {
    if (this.disciplineReport.reporterType === 'INMATE') {

      let selectedInmateReporter = this.inmateReporters.filter(item => {
        return item.id === this.disciplineReport.inmateId;
      });

      if (selectedInmateReporter && selectedInmateReporter.length > 0) {
        this.disciplineReport.reporterFirstName = selectedInmateReporter[0].firstName;
        this.disciplineReport.reporterLastName = selectedInmateReporter[0].lastName;
      } else {
        this.disciplineReport.reporterFirstName = null;
        this.disciplineReport.reporterLastName = null;
      }

    }

  }

  // Καθαρισμός πεδίων αναφέροντος έπειτα από αλλαγή του τύπου αναφέροντος
  clearReporterFieldsOnReporterTypeChanged() {
    if (this.disciplineReport.reporterType === 'INMATE') {
      this.disciplineReport.inmateId = null;
    }
    this.disciplineReport.reporterFirstName = null;
    this.disciplineReport.reporterLastName = null;
  }

  // Αποθήκευση αναφοράς πειθαρχικού
  saveDisciplineReport() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineReportService.saveDisciplineReport(this.disciplineReport).subscribe({
      next: (responseData: DisciplineReport) => {
        this.toitsuToasterService.showSuccessStay();
        this.disciplineReportForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/disciplinereport/view', responseData.id]);
        } else {

          // Ενημέρωση πεδίων αναφοράς πειθαρχικού
          this.setUpdatableDisciplineReportFields(responseData);

          this.disciplineReport = responseData;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      // Ενημέρωση συνδεδεμένων αναφορών πειθαρχικού πειθαρχικών παραπτωμάτων
      this.showRelatedDisciplinesOfDisciplineOffense();
      this.toitsuBlockUiService.unblockUi();
    });
  }

  // Διαγραφή αναφοράς πειθαρχικού
  deleteDisciplineReport() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.disciplineReportService.deleteDisciplineReport(this.disciplineReport.id).subscribe({
          next: (responseData: DisciplineReport) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.disciplineReportForm.form.markAsPristine();
            this.router.navigate(['/inm/disciplinereport/list']);
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

  // Άνοιγμα dialog συνδεδεμένων αναφορών πειθαρχικού ενός πειθαρχικού παραπτώματος
  openRelatedDisciplineReportsOfDisciplineOffenseDialog(index) {
    this.toitsuToasterService.clearMessages();
    const ref = this.dialogService.open(DisplayRelatedDisciplineReportsOfDisciplineOffenseDialogComponent, {
      header: this.translate.instant('disciplineReport.displayRelatedDisciplineReportsOfDisciplineOffense.dialogTitle'),
      data: {
        relatedDisciplineReportsOfDisciplineOffense: this.disciplineReport.discReportOffenses[index].relatedDisciplineReportsOfDisciplineOffense,
        disciplineReport: this.disciplineReport
      },
    });
    ref.onClose.subscribe(result => {
      if (result) {
        this.relatedDisciplineReportsOfDisciplineOffense = result;
      }
    });

  }

  // Ενημέρωση πεδίων αναφοράς πειθαρχικού
  setUpdatableDisciplineReportFields(disciplineReport: DisciplineReport) {
    if (disciplineReport.reporterType === 'INMATE') {
      disciplineReport.employeeId = null;
    } else if (disciplineReport.reporterType === 'EMPLOYEE') {
      disciplineReport.inmateId = null;
    } else if (disciplineReport.reporterType === 'OTHER') {
      disciplineReport.inmateId = null;
      disciplineReport.employeeId = null;
    }
  }

  // ΑΝΑΦΟΡΑ ΠΕΙΘΑΡΧΙΚΟΥ ---------------------------------------------------------------------------------------------------------------------------------------


  // ΠΕΙΘΑΡΧΙΚΑ ΠΑΡΑΠΤΩΜΑΤΑ ---------------------------------------------------------------------------------------------------------------------------------------

  // Ανάκτηση πειθαρχικού παραπτώματος από λίστα πειθαρχικών παραπτωμάτων με βάση το id
  getDisciplineOffenseFromDisciplineOffensesById(disciplineOffenseId): DisciplineOffense {
    let discReportOffense = this.disciplineReport.discReportOffenses.filter(disciplineReportDiscReportOffenses => disciplineReportDiscReportOffenses.disciplineOffenseId === disciplineOffenseId);
    if (disciplineOffenseId && discReportOffense.length === 1) {
      return discReportOffense[0].disciplineOffense;
    } else {
      return new DisciplineOffense();
    }
  }

  // Άνοιγμα dialog για δημιουργία πειθαρχικού παραπτώματος
  openCreateDisciplineOffenseDialog() {

    this.toitsuToasterService.clearMessages();
    
    let disciplineOffense: DisciplineOffense = new DisciplineOffense();
    
    disciplineOffense.disciplineReportIdToCheck = this.disciplineReport.id;
    
    const disciplineOffenseViewDialog = this.dialogService.open(DisciplineOffenseViewDialogComponent, {
      data: {
        disciplineOffense: disciplineOffense,
        firstDisciplineReportId: this.disciplineReport.id
      },
      closable: false,
      width: '50%'
    });
    disciplineOffenseViewDialog.onClose.subscribe(savedDisciplineOffense => {
      if (savedDisciplineOffense) {
        this.addDisciplineOffenseToDisciplineOffensesTable(savedDisciplineOffense);
      }
      console.log(this.disciplineReport.discReportOffenses);
    });
  }
  
  // Άνοιγμα dialog για τροποποίηση πειθαρχικού παραπτώματος
  openEditDisciplineOffenseDialog(index) {

    this.toitsuToasterService.clearMessages();
    const disciplineOffenseViewDialog = this.dialogService.open(DisciplineOffenseViewDialogComponent, {
        data: {
          disciplineOffense: this.disciplineReport.discReportOffenses[index].disciplineOffense,
          firstDisciplineReportId: this.disciplineReport.id
        },
        closable: false,
        width: '50%'
      });
    disciplineOffenseViewDialog.onClose.subscribe(result => {
        if (result) {
          this.disciplineReport.discReportOffenses[index].disciplineOffense = new DisciplineOffense();
          this.disciplineReport.discReportOffenses[index].disciplineOffense = result;
          this.editDisciplineOffenseInDisciplineOffensesTable(this.disciplineReport.discReportOffenses[index].disciplineOffense.id, this.disciplineReport.discReportOffenses[index].disciplineOffense);
        }
      });
  }

  // Εισαγωγή πειθαρχικού παραπτώματος στον πίνακα (p-table) "Αναφερόμενοι"
  addDisciplineOffenseToDisciplineOffensesTable(disciplineOffense) {
    
    // Αριθμός που δείχνει πόσες φορές υπάρχει το πειθαρχικό παράπτωμα στον πίνακα "Αναφερόμενοι"
    let disciplineOffenseInsideDisciplineOffensesTableCount = 0;
    
    // Για κάθε πειθαρχικό παράπτωμα της αναφοράς πειθαρχικών
    this.disciplineReport.discReportOffenses.forEach(disciplineReportOffense => {
      // Αν υπάρχει πειθαρχικό παράπτωμα με τον ίδιο κρατούμενο, την ίδια ημερομηνία συμβάντος και τον ίδιο τύπο πειθαρχικού παραπτώματος
      if ((disciplineReportOffense.disciplineOffense.inmateId === disciplineOffense.inmateId)
        && (disciplineReportOffense.disciplineOffense.incidentDate === disciplineOffense.incidentDate)
          && (disciplineReportOffense.disciplineOffense.offenseTypePid === disciplineOffense.offenseTypePid)) {

        // Αύξηση του αριθμού που δείχνει πόσες φορές υπάρχει το πειθαρχικό παράπτωμα στον πίνακα "Αναφερόμενοι" κατά 1
        disciplineOffenseInsideDisciplineOffensesTableCount ++ ;
        
      }
    });
    
    // Αν ο αριθμός που δείχνει πόσες φορές υπάρχει το πειθαρχικό παράπτωμα στον πίνακα (p-table) "Αναφερόμενοι" είναι μεγαλύτερος του 0
    if (disciplineOffenseInsideDisciplineOffensesTableCount > 0) {
      // Εμφάνιση μηνύματος 
      this.toitsuToasterService.showErrorStay(this.translate.instant('disciplineOffense.add.reportedAlreadyListed'));
      
      // Αλλιώς δημιουργία νέου πειθαρχικού παραπτώματος αναφοράς πειθαρχικού με τα στοιχεία του πειθαρχικού παραπτώματος και πέρασμα του στον πίνακα (p-table) "Αναφερόμενοι"
    } else if (disciplineOffense.id) {

      let discReportOffense = new DiscReportOffense();

      discReportOffense.disciplineOffense = disciplineOffense;
      discReportOffense.disciplineOffenseId = disciplineOffense.id;

      this.disciplineReport.discReportOffenses.push(discReportOffense);

      this.disciplineReportForm.form.markAsDirty();

    }
    
  }
  

  // Τροποποίηση πειθαρχικού παραπτώματος στον πίνακα (p-table) "Αναφερόμενοι"
  editDisciplineOffenseInDisciplineOffensesTable(disciplineOffenseId, disciplineOffense) {

    this.disciplineOffenseService.getDisciplineOffense(disciplineOffenseId).subscribe(result => {
      disciplineOffense = result;
    });

    let discReportOffenses = this.disciplineReport.discReportOffenses.filter(discReportOffenseResult => discReportOffenseResult.disciplineOffenseId === disciplineOffenseId);

    let discReportOffense = new DiscReportOffense();
    discReportOffense.disciplineOffense = disciplineOffense;

    if (disciplineOffenseId && discReportOffenses.length === 1) {
      this.disciplineReport.discReportOffenses.filter(disciplineOffenseResult => disciplineOffenseResult.disciplineOffenseId === disciplineOffenseId)[0].disciplineOffense = disciplineOffense;
    }
  }

  // Διαγραφή εγγραφής ενδιάμεσου πίνακα πειθαρχικού παραπτώματος αναφοράς πειθαρχικού
  deleteDiscReportOffense(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.disciplineReport.discReportOffenses.splice(index, 1);
          this.changeDetectorRef.detectChanges();
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.discReportOffenseService.deleteDiscReportOffense(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.disciplineReport.discReportOffenses.splice(index, 1);
              this.changeDetectorRef.detectChanges();
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

  // ΠΕΙΘΑΡΧΙΚΑ ΠΑΡΑΠΤΩΜΑΤΑ ---------------------------------------------------------------------------------------------------------------------------------------


  // ΜΑΡΤΥΡΕΣ ---------------------------------------------------------------------------------------------------------------------------------------

  // Προσθήκη Μάρτυρα
  addWitness() {
    let discReportWitness: DiscReportWitness = new DiscReportWitness();
    this.disciplineReport.discReportWitnesses.push(discReportWitness);
    this.changeDetectorRef.detectChanges();
  }

  // Αλλαγή ονόματος και επωνύμου μάρτυρα
  witnessFirstAndLastNameChanged(discReportWitness) {
    // Έλεγχος ανά τύπο μάρτυρα
    if (discReportWitness.witnessType === 'INMATE') {

      // Εύρεση επιλεγμένου μάρτυρα τύπου 'Κρατούμενος' από την λίστα Κρατουμένων
      let selectedInmateWitness = this.inmateWitnesses.filter(item => {
        return item.id === discReportWitness.inmateId;
      });

      // Αλλαγή ονόματος και επωνύμου μάρτυρα
      if (selectedInmateWitness && selectedInmateWitness.length > 0) {
        discReportWitness.witnessFirstName = selectedInmateWitness[0].firstName;
        discReportWitness.witnessLastName = selectedInmateWitness[0].lastName;
      } else {
        discReportWitness.witnessFirstName = null;
        discReportWitness.witnessLastName = null;
      }

    } // Αντίστοιχη μελλοντική υλοποίηση για Υπαλλήλους όταν φτιαχτεί ο πίνακας 'Υπάλληλοι'

  }

  // Καθαρισμός πεδίων μάρτυρα έπειτα από αλλαγή του τύπου μάρτυρα
  clearWitnessFieldsOnWitnessTypeChanged(discReportWitness) {
    // Έλεγχος ανά τύπο μάρτυρα
    if (discReportWitness.witnessType === 'INMATE') {
      discReportWitness.inmateId = null;
    } else if (discReportWitness.witnessType === 'EMPLOYEE') {
      discReportWitness.employeeId = null;
    }
    discReportWitness.witnessFirstName = null;
    discReportWitness.witnessLastName = null;
  }

  // Αφαίρεση γραμμής μάρτυρα από τον πίνακα (p-table) "Μάρτυρες"
  removeWitnessRowFromDiscReportWitnessesTable(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.disciplineReport.discReportWitnesses.splice(index, 1);
          this.changeDetectorRef.detectChanges();
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.discReportWitnessService.deleteDiscReportWitness(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.disciplineReport.discReportWitnesses.splice(index, 1);
              this.changeDetectorRef.detectChanges();
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

  // ΜΑΡΤΥΡΕΣ ---------------------------------------------------------------------------------------------------------------------------------------

}

