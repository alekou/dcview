import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DisciplineDecision} from '../discipline-decision.model';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuNavService} from '../../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {DisciplineDecisionService} from '../discipline-decision.service';
import {GenParameterService} from '../../../sa/gen-parameter/gen-parameter.service';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {Router} from '@angular/router';
import {
  SelectDisciplineOffensesToMergeDialogComponent
} from './select-discipline-offenses-to-merge-dialog/select-discipline-offenses-to-merge-dialog.component';
import {DisciplineOffense} from '../../discipline-offense/discipline-offense.model';
import {DisciplineOffenseService} from '../../discipline-offense/discipline-offense.service';
import {
  UnmergeDisciplineOffensesDialogComponent
} from './unmerge-discipline-offenses-dialog/unmerge-discipline-offenses-dialog.component';
import {DisciplineService} from '../../discipline/discipline.service';
import {DisciplineCouncil} from '../../discipline-council/discipline-council.model';


@Component({
  selector: 'app-inm-discipline-decision-view-dialog',
  templateUrl: 'discipline-decision-view-dialog.component.html'
})

export class DisciplineDecisionViewDialogComponent implements OnInit {

  // Απόφαση Πειθαρχικών Παραπτωμάτων
  @ViewChild(NgForm) disciplineDecisionForm: NgForm;
  disciplineCouncil: DisciplineCouncil = new DisciplineCouncil();
  disciplineDecision: DisciplineDecision = new DisciplineDecision();
  disciplineDecisionCopy: DisciplineDecision = new DisciplineDecision();
  disciplineOffensePenaltyTypeParams = {};
  disciplineOffenseStatusTypes = [];
  isDisciplineDecisionDialogLoading: boolean = true;
  disciplinesCreatedByGivenDisciplineDecision: any = [];

  // Συγχώνευση Πειθαρχικών Παραπτωμάτων
  candidateDisciplineOffensesToMerge: DisciplineOffense[] = [];

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    private disciplineDecisionService: DisciplineDecisionService,
    private disciplineOffenseService: DisciplineOffenseService,
    private disciplineService: DisciplineService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private enumService: EnumService,
    private router: Router,
  ) {
  }


  ngOnInit() {
    // Απόφαση Πειθαρχικών 
    this.disciplineDecision = this.dynamicDialogConfig.data.disciplineDecision;
    // Συμβούλιο Πειθαρχικών στο οποίο ανήκει η Απόφαση Πειθαρχικών
    this.disciplineCouncil = this.dynamicDialogConfig.data.disciplineCouncil;

    console.log(this.disciplineCouncil);

    // Εάν πρόκειται για δημιουργία νέας απόφασης πειθαρχικών
    if (this.disciplineDecision.id === null) {
      // Γέμισμα της λίστας πειθαρχικών παραπτωμάτων της νέας απόφασης πειθαρχικών, με τα επιλεγμένα πειθαρχικά παραπτώματα
      this.disciplineDecision.disciplineOffenses = this.dynamicDialogConfig.data.selectedDisciplineOffensesForNewDisciplineDecision;
      // Αρχικοποίηση πεδίου id συμβουλίου πειθαρχικών της απόφασης πειθαρχικών, με το id του συμβουλίου πειθαρχικών
      this.disciplineDecision.disciplineCouncilId = this.dynamicDialogConfig.data.disciplineCouncilId;
    }

    // Αντίγραφο Απόφασης Πειθαρχικών προς Επεξεργασία
    // Χρησιμοποιείται έτσι ώστε αν ο χρήστης πατήσει ο κουμπί "Αποθήκευση Επεξεργασμένης Απόφασης Πειθαρχικών" του dialog, η Απόφαση Πειθαρχικών και η λίστα Πειθαρχικών Παραπτωμάτων του να τροποποιηθεί.
    this.disciplineDecisionCopy = this.copyObject(this.disciplineDecision);

    // Αρχικοποίηση κατάστασης πειθαρχικών παραπτωμάτων του αντίγραφου λίστας σε 'ένοχος'.
    // Η αρχικοποίηση αυτή πραγματοποιείται για να επιτραπεί το φιλτράρισμα των τύπων των Καταστάσεων Πειθαρχικών Παραπτωμάτων, με μόνες τιμές 'ένοχος' και 'αθώος'
    this.disciplineDecisionCopy.disciplineOffenses.forEach(disciplineOffense => {
      // Εάν η κατάσταση δεν είναι Αθώος
      if (disciplineOffense.status !== 'INNOCENT') {
        // Η κατάσταση ορίζεται σε 'Ένοχος'
        disciplineOffense.status = 'GUILTY';
      }
    });

    // Είδη Ποινής
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_PenaltyType, this.disciplineDecision.disciplineOffenses.map(disciplineOffense => disciplineOffense.penaltyTypePid)).subscribe(responseData => {
      this.disciplineOffensePenaltyTypeParams = responseData;
    });

    // Τύποι Καταστάσεων Πειθαρχικών Παραπτωμάτων
    this.enumService.getEnumValues('inm.core.enums.DisciplineOffenseStatus').subscribe(responseData => {
      this.disciplineOffenseStatusTypes = responseData.filter(disciplineOffenseStatusType =>
        (disciplineOffenseStatusType['value'] === 'GUILTY' || disciplineOffenseStatusType['value'] === 'INNOCENT')
      );

      // Ανάκτηση πειθαρχικών που δημιουργήθηκαν απο την δοθείσα αποφάση πειθαρχικών
      if (this.disciplineDecisionCopy.id) {
        this.disciplineService.getDisciplinesCreatedByGivenDisciplineDecision(this.disciplineDecisionCopy.id).subscribe(response => {
          this.disciplinesCreatedByGivenDisciplineDecision = response;
        });
      }
      
    });

    // Ανανέωση των πειθαρχικών παραπτωμάτων του αντιγράφου της απόφασης πειθαρχικών
    // Χρησιμοποιείται έτσι ώστε εάν ο χρήστης προβεί σε συγχώνευση / αποσυγχώνευση πειθαρχικών παραπτωμάτων, και στην συνέχεια πατήσει ακύρωση του dialog "Στοιχεία Απόφασης Πειθαρχικού",
    // όταν ο χρήστης ξανανοίξει το dialog ο πίνακας (p-table) των πειθαρχικών παραπτωμάτων να συμπεριλαμβάνει και τα συγχωνευμένα / συγχωνευτικά παραπτώματα.
    this.refreshDisciplineOffensesInsideDisciplineDecisionDialog();

  }

  // ΑΠΌΦΑΣΗ ΠΕΙΘΑΡΧΙΚΏΝ -------------------------------------------------------------------------------------------------------------------

  // Μέθοδος Αντιγραφής Αντικειμένου
  copyObject(originalObject: any): any {
    return JSON.parse(JSON.stringify(originalObject));
  }

  // Ακύρωση
  cancel() {
    if (this.disciplineDecisionForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {
        }
      });
    } else {
      this.dynamicDialogRef.close();
    }
  }

  // Αποθήκευση Επεξεργασμένης Απόφασης Πειθαρχικών
  saveDisciplineDecision() {

    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineDecisionService.saveDisciplineDecision(this.disciplineDecisionCopy, this.disciplineDecision.disciplineCouncilId).subscribe({
      next: (responseData) => {

        let savedDisciplineDecision = responseData;
        this.dynamicDialogRef.close(savedDisciplineDecision);

        // Ανανέωση σελίδας για ενημέρωση πεδίων των p-table του p-tabView στην σελίδα του συμβουλίου πειθαρχικών
        this.router.navigate(['/']).then(() => {
          this.router.navigate(['/inm/disciplinecouncil/view', this.disciplineDecision.disciplineCouncilId]);
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

  // Μέθοδος κλειδώματος πεδίων υπό συνθήκη 
  // Ελέγχει αν δημιουργήθηκαν πειθαρχικά από την δοθείσα απόφαση πειθαρχικών
  lockIfDisciplineDecisionCreatedDisciplines(): boolean {

    // Αν η λίστα πειθαρχικών που δημιουργήθηκαν απο την δοθείσα αποφάση πειθαρχικών δεν είναι άδεια
    if (this.disciplinesCreatedByGivenDisciplineDecision.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  // Μέθοδος απόκρυψης πεδίων υπό συνθήκη 
  // Ελέγχει αν δημιουργήθηκαν πειθαρχικά από την δοθείσα απόφαση πειθαρχικών
  showIfDisciplineDecisionCreatedDisciplines(): boolean {

    // Αν η λίστα πειθαρχικών που δημιουργήθηκαν απο την δοθείσα αποφάση πειθαρχικών δεν είναι άδεια
    if (this.disciplinesCreatedByGivenDisciplineDecision.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  // Μέθοδος κλειδώματος πεδίων υπό συνθήκη 
  // Ελέγχει αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απόφαση πειθαρχικών, έχει ολοκληρωθεί
  lockIfDisciplineCouncilOfDisciplineDecisionIsComplete(): boolean {

    // Αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απόφαση πειθαρχικών, έχει ολοκληρωθεί
    if (this.disciplineCouncil.completed) {
      return true;
    } else {
      return false;
    }

  }

  // Μέθοδος απόκρυψης πεδίων υπό συνθήκη 
  // Ελέγχει αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απόφαση πειθαρχικών, έχει ολοκληρωθεί
  showIfDisciplineCouncilOfDisciplineDecisionIsComplete(): boolean {

    // Αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απόφαση πειθαρχικών, έχει ολοκληρωθεί
    if (this.disciplineCouncil.completed) {
      return true;
    } else {
      return false;
    }

  }

  // ΣΥΓΧΏΝΕΥΣΗ / ΑΠΟΣΥΓΧΏΝΕΥΣΗ ΠΕΙΘΑΡΧΙΚΏΝ ΠΑΡΑΠΤΩΜΆΤΩΝ -------------------------------------------------------------------------------------------------------------------

  // Μέθοδος συγχώνευσης κελιών p-table (Χρησιμοποιείται για να εμφανίζεται μόνο μία στήλη των συγχωνευτικών πειθαρχικών παραπτωμάτων στο p-table)
  shouldMergeCells(disciplineOffense: DisciplineOffense): boolean {
    return !!disciplineOffense.displayName;
  }

  // Μέθοδος χρωματισμού σειράς p-table (Χρησιμοποιείται για να αλλάζουν χρώμα οι γραμμές των συγχωνευμένων πειθαρχικών παραπτωμάτων στο p-table)
  getRowStyleClass(disciplineOffense): string {
    if (disciplineOffense.merged === true) {
      return 'background-color: lightcoral';
    } else {
      return '';
    }
  }
  
  // Φιλτράρισμα υποψήφιων πειθαρχικών παραπτωμάτων προς συγχώνευση
  candidateDisciplineOffensesToMergeFilter(inmateId) {
    // Άδεισμα λίστας υποψήφιων πειθαρχικών παραπτωμάτων προς συγχώνευση
    this.candidateDisciplineOffensesToMerge.length = 0;

    // Για κάθε πειθαρχικό παράπτωμα της απόφασης πειθαρχικών
    this.disciplineDecisionCopy.disciplineOffenses.forEach(disciplineOffense => {
      // Έλεγχος αν το πειθαρχικό παράπτωμα: ανήκει στον δοθέν κρατούμενο, αν η κατάσταση του είναι "Ένοχος", η ένδειξη συγχωνευμένο είναι ψευδής, η ένδειξη συγχωνευτικό είναι ψευδής, και αν δεν υπάρχει σχετικό πειθαρχικό παράπτωμα.
      if (disciplineOffense.inmateId === inmateId && disciplineOffense.status === 'GUILTY' && disciplineOffense.merged === false && disciplineOffense.merging === false && disciplineOffense.relatedDiscOffenseId === null) {
        // Γέμισμα λίστας υποψήφιων πειθαρχικών παραπτωμάτων προς συγχώνευση
        this.candidateDisciplineOffensesToMerge.push(disciplineOffense);
      }
    });
  }

  // Ανανέωση των πειθαρχικών παραπτωμάτων του αντιγράφου της απόφασης πειθαρχικών
  // Δημιουργήθηκε για να ανανεώνονται τα πεδία των πειθαρχικών παραπτωμάτων που συγχωνεύτηκαν και να μπαίνει στο p-table το νέο συγχωνευτικό
  // αφού κλείσει επιτυχώς το dialog "Συγχώνευση Πειθαρχικών Παραπτωμάτων"
  refreshDisciplineOffensesInsideDisciplineDecisionDialog() {
    
    // Άν υπάρχει απόφαση πειθαρχικού
    if (this.disciplineDecision.id) {

      this.disciplineOffenseService.getDisciplineOffensesByDisciplineDecisionId(this.disciplineDecision.id).subscribe(response => {
        // Νέα προσωρινή λίστα πειθαρχικών παραπτωμάτων απόφασης πειθαρχικών
        let disciplineOffensesOfDisciplineDecisionTemp: any = [];
        // Γέμισμα λίστας
        disciplineOffensesOfDisciplineDecisionTemp = response;

        // Άδεισμα λίστας πειθαρχικών παραπτωμάτων του αντιγράφου της απόφασης πειθαρχικών
        this.disciplineDecisionCopy.disciplineOffenses = [];

        // Για κάθε πειθαρχικό παράπτωμα της προσωρινής λίστας πειθαρχικών παραπτωμάτων απόφασης πειθαρχικών
        disciplineOffensesOfDisciplineDecisionTemp.forEach(disciplineOffenseOfDisciplineDecision => {
          // Γέμισμα λίστας πειθαρχικών παραπτωμάτων του αντιγράφου της απόφασης πειθαρχικών με πειθαρχικό παράπτωμα της προσωρινής λίστας πειθαρχικών παραπτωμάτων απόφασης πειθαρχικών
          this.disciplineDecisionCopy.disciplineOffenses.push(disciplineOffenseOfDisciplineDecision);
        });

      }).add(() => {
        // Φόρτωση του dialog απόφασης πειθαρχικών
        this.isDisciplineDecisionDialogLoading = false;
      });

    } else {
      // Φόρτωση του dialog απόφασης πειθαρχικών
      this.isDisciplineDecisionDialogLoading = false;
    }

  }

  // Άνοιγμα dialog για συγχώνευση πειθαρχικών παραπτωμάτων απόφασης πειθαρχικού
  openMergeDisciplineOffensesDialog(inmateId) {
    
    // Φιλτράρισμα υποψήφιων πειθαρχικών παραπτωμάτων προς συγχώνευση
    this.candidateDisciplineOffensesToMergeFilter(inmateId);

    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(SelectDisciplineOffensesToMergeDialogComponent, {
      header: this.translate.instant('disciplineDecision.mergeDisciplineOffenses.dialogTitle'),
      data: {
        // id κρατουμένου στον οποίο ανήκουν τα υποψήφια προς συγχώνευση πειθαρχικά παραπτώματα
        inmateId: inmateId,
        // Λίστα με τα υποψήφια προς συγχώνευση πειθαρχικά παραπτώματα
        candidateDisciplineOffensesToMerge: this.candidateDisciplineOffensesToMerge
      },
      closable: false,
    });

    dialogRef.onClose.subscribe((result) => {
      // Άν γίνει επιτυχής συγχώνευση των πειθαρχικών παραπτωμάτων
      if (result) {

        // Ανανέωση των πειθαρχικών παραπτωμάτων του αντιγράφου της απόφασης πειθαρχικών
        this.refreshDisciplineOffensesInsideDisciplineDecisionDialog();

      }
    });
  }
  
  // Άνοιγμα dialog για αποσυγχώνευση πειθαρχικών παραπτωμάτων απόφασης πειθαρχικού
  openUnmergeDisciplineOffensesDialog(disciplineOffense) {

    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(UnmergeDisciplineOffensesDialogComponent, {
      header: this.translate.instant('disciplineDecision.unmergeDisciplineOffense.dialogTitle'),
      data: {
        // id κρατουμένου του συγχωνευτικού πειθαρχικού παραπτώματος που επρόκειτο να αποσυγχωνευθεί
        inmateId: disciplineOffense.inmateId,
        // id συγχωνευτικού πειθαρχικού παραπτώματος που επρόκειτο να αποσυγχωνευθεί
        disciplineOffenseIdToUnmerge: disciplineOffense.id
      }
    });

    dialogRef.onClose.subscribe((result) => {
      // Άν γίνει επιτυχής συγχώνευση των πειθαρχικών παραπτωμάτων
      if (result) {

        // Ανανέωση των πειθαρχικών παραπτωμάτων του αντιγράφου της απόφασης πειθαρχικών
        this.refreshDisciplineOffensesInsideDisciplineDecisionDialog();
        
      }
    });

  }


}
