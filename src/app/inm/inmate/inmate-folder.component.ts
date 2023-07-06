import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ConfirmationService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {InmateService} from './inmate.service';
import {InmateRecordService} from '../inmate-record/inmate-record.service';
import {JudgmentService} from '../judgment/judgment.service';
import {AppealService} from '../appeal/appeal.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {CountryService} from '../../sa/country/country.service';
import {CityService} from '../../sa/city/city.service';
import {ClassificationService} from '../../sa/classification/classification.service';
import {Inmate} from './inmate.model';
import {Judgment} from '../judgment/judgment.model';
import {InmateRecord} from '../inmate-record/inmate-record.model';
import {Appeal} from '../appeal/appeal.model';
import {CloseInmateFolderDialogComponent} from './close-inmate-folder-dialog/close-inmate-folder-dialog.component';
import {CloseInmateRecordDialogComponent} from '../inmate-record/close-inmate-record-dialog/close-inmate-record-dialog.component';
import {ChangeCriminalStatusDialogComponent} from '../inmate-record/change-criminal-status-dialog/change-criminal-status-dialog.component';
import {ChangeCurrentJudgmentDialogComponent} from '../judgment/change-current-judgment-dialog/change-current-judgment-dialog.component';
import {MergeJudgmentsDialogComponent} from '../judgment/merge-judgments-dialog/merge-judgments-dialog.component';
import {UnmergeJudgmentDialogComponent} from '../judgment/unmerge-judgment-dialog/unmerge-judgment-dialog.component';
import {CancelJudgmentDialogComponent} from '../judgment/cancel-judgment-dialog/cancel-judgment-dialog.component';
import {RevertCancelledJudgmentDialogComponent} from '../judgment/revert-cancelled-judgment-dialog/revert-cancelled-judgment-dialog.component';
import {MoveBeneficialCalculationDialogComponent} from '../judgment/move-beneficial-calculation-dialog/move-beneficial-calculation-dialog.component';

@Component({
  selector: 'app-inm-inmate-folder',
  templateUrl: 'inmate-folder.component.html',
  styleUrls: ['inmate-folder.component.css']
})
export class InmateFolderComponent implements OnInit, ExitConfirmation {
  
  id: number;
  inmate: Inmate;
  @ViewChild(NgForm) inmateFolderForm: NgForm;
  
  hasActiveRecordInUserDc = false;
  hasTemporaryRecordInUserDc = false;
  categoryOfOpenInmateRecordInUserDc = null;
  
  folderStatuses = [];
  pFolderOpeningReason = {};
  closingFolderClassifications = [];
  greekCities = [];
  
  pDaOffice = {};
  judgmentTypes = [];
  pJudgmentCategory = {};
  pFact = {};
  pSentence = {};
  crimeClassifications = [];
  pSentenceFeeCurrency = {};
  pSequential = {};
  
  inmateRecordStatuses = [];
  inmateRecordCategories = [];
  pCharacterization = {};
  pDurationType = {};
  pDuration = {};
  pEntryReason = {};
  pCameFromPlace = {};
  closingRecordClassifications = [];
  pEscortStatus = {};
  pEscortService = {};
  
  pAppealType = {};
  
  showAllJudgmentsChecked = false;
  
  visibleJudgmentCount = 0;
  judgmentGroupingByType = '';
  
  candidateJudgmentsToSetCurrent = [];
  candidateJudgmentsToMerge = [];
  
  judgmentActiveIndex = -1;
  inmateRecordActiveIndex = -1;
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private dateService: DateService,
    private inmateService: InmateService,
    private inmateRecordService: InmateRecordService,
    private judgmentService: JudgmentService,
    private appealService: AppealService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService,
    private countryService: CountryService,
    private cityService: CityService,
    private classificationService: ClassificationService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver
    this.inmate = this.route.snapshot.data['record'];
    
    // Συγκένρωση των επιπλέον ids για τις λίστες
    let greekCityIds = [];
    let daOfficePids = [];
    let judgmentCategoryPids = [];
    let factPids = [];
    let sentencePids = [];
    let crimeClassificationIds = [];
    let sentenceFeeCurrencyPids = [];
    let sequentialPids = [];
    this.inmate.judgments.forEach(judgment => {
      if (judgment.daOfficePid) { daOfficePids.push(judgment.daOfficePid); }
      if (judgment.daOfficeCityId) { greekCityIds.push(judgment.daOfficeCityId); }
      if (judgment.categoryPid) { judgmentCategoryPids.push(judgment.categoryPid); }
      if (judgment.factPid) { factPids.push(judgment.factPid); }
      if (judgment.sentencePid) { sentencePids.push(judgment.sentencePid); }
      if (judgment.factClassificationId) { crimeClassificationIds.push(judgment.factClassificationId); }
      if (judgment.sentenceFeeCurrencyPid) { sentenceFeeCurrencyPids.push(judgment.sentenceFeeCurrencyPid); }
      if (judgment.sequentialPid) { sequentialPids.push(judgment.sequentialPid); }
    });
    
    let characterizationPids = [];
    let durationTypePids = [];
    let durationPids = [];
    let entryReasonPids = [];
    let cameFromPlacePids = [];
    let closingClassificationIds = [];
    let escortStatusPids = [];
    let escortServicePids = [];
    this.inmate.inmateRecords.forEach(inmateRecord => {
      if (inmateRecord.characterizationPid) { characterizationPids.push(inmateRecord.characterizationPid); }
      if (inmateRecord.durationTypePid) { durationTypePids.push(inmateRecord.characterizationPid); }
      if (inmateRecord.durationPid) { durationPids.push(inmateRecord.characterizationPid); }
      if (inmateRecord.entryReasonPid) { entryReasonPids.push(inmateRecord.characterizationPid); }
      if (inmateRecord.cameFromPlacePid) { cameFromPlacePids.push(inmateRecord.characterizationPid); }
      if (inmateRecord.cameFromCityId) { greekCityIds.push(inmateRecord.cameFromCityId); }
      if (inmateRecord.closingClassificationId) { closingClassificationIds.push(inmateRecord.closingClassificationId); }
      if (inmateRecord.escortStatusPid) { escortStatusPids.push(inmateRecord.escortStatusPid); }
      if (inmateRecord.escortServicePid) { escortServicePids.push(inmateRecord.escortServicePid); }
    });
    
    let appealTypePids = [];
    this.inmate.appeals.forEach(appeal => {
      if (appeal.appealTypePid) { appealTypePids.push(appeal.appealTypePid); }
    });
    
    // Λίστες
    this.enumService.getEnumValues('inm.core.enums.InmateFolderStatus').subscribe(responseData => {
      this.folderStatuses = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_FolderOpeningReason, [this.inmate.folderOpeningReasonPid]).subscribe(responseData => {
      this.pFolderOpeningReason = responseData;
    });
    this.classificationService.getActiveClassificationsByTypeOption('CLOSING_FOLDER', [this.inmate.folderClosingClassificationId]).subscribe(responseData => {
      this.closingFolderClassifications = responseData;
    });
    this.cityService.getGreekCities(true, greekCityIds).subscribe(responseData => {
      this.greekCities = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_DaOffice, daOfficePids).subscribe(responseData => {
      this.pDaOffice = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.JudgmentType').subscribe(responseData => {
      this.judgmentTypes = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Category, judgmentCategoryPids).subscribe(responseData => {
      this.pJudgmentCategory = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Fact, factPids).subscribe(responseData => {
      this.pFact = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Sentence, sentencePids).subscribe(responseData => {
      this.pSentence = responseData;
    });
    this.classificationService.getActiveClassificationsByTypeOption('CRIME', crimeClassificationIds).subscribe(responseData => {
      this.crimeClassifications = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_SentenceFeeCurrency, sentenceFeeCurrencyPids).subscribe(responseData => {
      this.pSentenceFeeCurrency = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Sequential, sequentialPids).subscribe(responseData => {
      this.pSequential = responseData;
    });
    
    this.enumService.getEnumValues('inm.core.enums.InmateRecordStatus').subscribe(responseData => {
      this.inmateRecordStatuses = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.InmateRecordCategory').subscribe(responseData => {
      this.inmateRecordCategories = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_Characterization, characterizationPids).subscribe(responseData => {
      this.pCharacterization = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_DurationType, durationTypePids).subscribe(responseData => {
      this.pDurationType = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_Duration, durationPids).subscribe(responseData => {
      this.pDuration = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_EntryReason, entryReasonPids).subscribe(responseData => {
      this.pEntryReason = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_CameFromPlace, cameFromPlacePids).subscribe(responseData => {
      this.pCameFromPlace = responseData;
    });
    this.classificationService.getActiveClassificationsByTypeOption('CLOSING_RECORD', closingClassificationIds).subscribe(responseData => {
      this.closingRecordClassifications = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_EscortStatus, escortStatusPids).subscribe(responseData => {
      this.pEscortStatus = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_EscortService, escortServicePids).subscribe(responseData => {
      this.pEscortService = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Appeal_Type, appealTypePids).subscribe(responseData => {
      this.pAppealType = responseData;
    });
    
    // Το accordionTab της τρέχουσας απόφασης είναι ανοιχτό
    for (let i = 0; i < this.inmate.judgments.length; i++) {
      if (this.inmate.judgments[i].current) {
        this.judgmentActiveIndex = i;
      }
    }
    
    // Το accordionTab της τελευταίας κράτησης είναι ανοιχτό
    for (let i = 0; i < this.inmate.inmateRecords.length; i++) {
      if (this.inmate.inmateRecords[i].lastRecord) {
        this.inmateRecordActiveIndex = i;
      }
    }
    
    // Αρχικοποίηση βοηθητικών μεταβλητών
    this.initializeAssistingVariables();
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.inmateFolderForm.dirty;
  }
  
  goToList() {
    this.router.navigate(['/inm/inmate/list']);
  }
  
  goToView() {
    this.router.navigate(['/inm/inmate/view', this.id]);
  }
  
  /**
   * Αρχικοποίηση βοηθητικών μεταβλητών
   */
  initializeAssistingVariables() {
    
    // Ορισμός μεταβλητής για το αν υπάρχει ενεργή (ανοιχτή/αδυναμία/προσωρινή) κράτηση στο κατάστημα του χρήστη
    let filteredActiveInmateRecords = this.inmate.inmateRecords.filter(item => {
      return (item.dcId === this.authService.getUserDcId() && (item.status === 'OPEN' || item.status === 'INABILITY' || item.status === 'TEMPORARY'));
    });
    if (filteredActiveInmateRecords && filteredActiveInmateRecords.length > 0) {
      this.hasActiveRecordInUserDc = true;
    }
    
    // Ορισμός μεταβλητής για το αν υπάρχει προσωρινή κράτηση στο κατάστημα του χρήστη
    let filteredTemporaryInmateRecords = this.inmate.inmateRecords.filter(item => {
      return (item.dcId === this.authService.getUserDcId() && item.status === 'TEMPORARY');
    });
    if (filteredTemporaryInmateRecords && filteredTemporaryInmateRecords.length > 0) {
      this.hasTemporaryRecordInUserDc = true;
    }
    
    // Η κατηγορία της ανοιχτής κράτησης στο κατάστημα του χρήστη
    let filteredOpenInmateRecords = this.inmate.inmateRecords.filter(item => {
      return (item.dcId === this.authService.getUserDcId() && item.status === 'OPEN');
    });
    if (filteredOpenInmateRecords && filteredOpenInmateRecords.length > 0) {
      this.categoryOfOpenInmateRecordInUserDc = filteredOpenInmateRecords[0].category;
    }
    
    // Για κάθε απόφαση
    this.inmate.judgments.forEach(judgment => {
      // Ορισμός του isHidden σε true αν είναι ακυρωμένη ή συγχωνευμένη
      if (judgment.cancelled || judgment.merged) {
        judgment.isHidden = true;
      }
      // Ορισμός του isRelated σε true αν είναι σχετική άλλης
      if (this.getJudgmentsHavingThisAsRelated(judgment.id).length > 0) {
        judgment.isRelated = true;
      }
    });
    
    // Αποτσεκάρισμα του checkbox εμφάνισης όλων των αποφάσεων
    this.showAllJudgmentsChecked = false;
    
    // Το πλήθος των ορατών αποφάσεων
    this.visibleJudgmentCount = this.inmate.judgments.filter(item => {
      return (!item.cancelled && !item.merged);
    }).length;
    
    // Σύνθεση του κειμένου με τα πλήθη των ορατών αποφάσεων ανά τυπο
    this.judgmentGroupingByType = '';
    let convictJudgmentCount = this.inmate.judgments.filter(item => {
      return (!item.cancelled && !item.merged && item.type === 'CONVICT');
    }).length;
    let inCustodyJudgmentCount = this.inmate.judgments.filter(item => {
      return (!item.cancelled && !item.merged && item.type === 'IN_CUSTODY');
    }).length;
    let debtorJudgmentCount = this.inmate.judgments.filter(item => {
      return (!item.cancelled && !item.merged && item.type === 'DEBTOR');
    }).length;
    
    if (convictJudgmentCount > 0) {
      this.judgmentGroupingByType = ' | K=' + convictJudgmentCount;
    }
    if (inCustodyJudgmentCount > 0) {
      if (this.judgmentGroupingByType.length === 0) {
        this.judgmentGroupingByType = ' | Y=' + inCustodyJudgmentCount;
      }
      else {
        this.judgmentGroupingByType += ', Y=' + inCustodyJudgmentCount;
      }
    }
    if (debtorJudgmentCount > 0) {
      if (this.judgmentGroupingByType.length === 0) {
        this.judgmentGroupingByType = ' | O=' + debtorJudgmentCount;
      }
      else {
        this.judgmentGroupingByType += ', O=' + debtorJudgmentCount;
      }
    }
    
    // Οι υποψήφιες αποφάσεις προς ορισμό τρέχουσας
    // Είναι οι μη ακυρωμένες, μη συγχωνευμένες, μη εκτελεσθείσες και όχι η τρέχουσα
    this.candidateJudgmentsToSetCurrent = this.inmate.judgments.filter(item => {
      return (!item.cancelled && !item.merged && !item.completed && !item.current);
    });
    
    // Οι υποψήφιες αποφάσεις προς συγχώνευση
    // Είναι οι μη ακυρωμένες, μη συγχωνυμένες μη εκτελεσθείσες και όχι με τύπο υποδικία
    this.candidateJudgmentsToMerge = this.inmate.judgments.filter(item => {
      return (!item.cancelled && !item.merged && !item.completed && item.type !== 'IN_CUSTODY');
    });
  }
  
  /**
   * Συνθήκη κλειδώματος όλου του φακέλου
   */
  lockedFolder() {
    
    // Υπουργείο -> ο φάκελος είναι κλειδωμένος
    if (this.authService.isMinistry()) {
      return true;
    }
    
    // Αν ο φάκελος είναι κλειστός, ο φάκελος είναι κλειδωμένος
    if (this.inmate.folderStatus === 'CLOSED') {
      return true;
    }
    
    // Κατάστημα -> χρησιμοποιείται η συνθήκη που έρχεται από το api
    // (να υπάρχει στο κατάστημα του χρήστη κράτηση ενεργη/αδυναμια ή κράτηση με lastRecord = 1
    // και να μην υπάρχει ανοιχτή/αδυναμία αλλού)
    return !this.inmate.canEditInmate;
  }
  
  /**
   * Συνθήκη κλειδώματος μιας κράτησης
   */
  lockedInmateRecord(inmateRecord) {
    
    // Υπουργείο -> η κράτηση είναι κλειδωμένη
    if (this.authService.isMinistry()) {
      return true;
    }
    
    // Η νέα κράτηση είναι επεξεργάσιμη
    if (!inmateRecord.id) {
      return false;
    }
    
    if (inmateRecord.status === 'CLOSED') {
      // Αν είναι κλειστή, είναι κλειδωμένη
      return true;
    }
    else if (inmateRecord.dcId === this.authService.getUserDcId()) {
      // Αν είναι ενεργή (ανοιχτή/αδυναμία/προσωρινή) και στο κατάστημα του χρήστη, είναι επεξεργάσιμη
      return false;
    }
    
    return true;
  }
  
  /**
   * Συνθήκη επιτρεπόμενης εισαγωγής νέας κράτησης
   */
  canAddNewInmateRecord() {
    
    // Αν ο φάκελος είναι κλειστός, δεν μπορεί να προστεθεί νέα κράτηση
    if (this.inmate.folderStatus === 'CLOSED') {
      return false;
    }
    
    // ΔΕΝ μπορεί να προσθέσει νέα κράτηση αν ο κρατούμενος έχει ενεργή (ανοιχτή/αδυναμία/προσωρινή) κράτηση ή έχει ήδη προστεθεί νέα κράτηση
    let activeOrNewInmateRecords = this.inmate.inmateRecords.filter(item => {
      return (item.status === 'OPEN' || item.status === 'INABILITY' || item.status === 'TEMPORARY') || !item.id;
    });
    
    return !(activeOrNewInmateRecords && activeOrNewInmateRecords.length > 0);
  }
  
  /**
   * Συνθήκη επιτρεπόμενης διαγραφής μιας κράτησης
   */
  canDeleteInmateRecord(inmateRecord) {
    
    // Η νέα εγγραφή μπορεί να διαγραφεί
    if (!inmateRecord.id) {
      return true;
    }
    
    // Αν ο φάκελος είναι κλειστός, η κράτηση δεν μπορεί να διαγραφεί
    if (this.inmate.folderStatus === 'CLOSED') {
      return false;
    }
    
    // Μπορεί να διαγραφεί μόνο αν είναι του καταστήματος, χωρίς lastRecord/lastRecordDc και κλειστή
    if (inmateRecord.dcId === this.authService.getUserDcId() && !inmateRecord.lastRecord && !inmateRecord.lastRecordDc && inmateRecord.status === 'CLOSED') {
      return true;
    }
    
    return false;
  }

  /**
   * Αποθήκευση
   */
  saveInmateFolder() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.inmateService.saveInmateFolder(this.inmate).subscribe({
      next: (responseData: Inmate) => {
        this.toitsuToasterService.showSuccessStay();
        this.inmateFolderForm.form.markAsPristine();
        this.inmate = responseData;
        this.initializeAssistingVariables();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  /**
   * Κλείσιμο φακέλου
   */
  openCloseInmateFolderDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CloseInmateFolderDialogComponent, {
      header: this.translate.instant('inmate.folder.close.dialogTitle'),
      width: '40%',
      data: {
        inmateId: this.id,
        closinFolderClassifications: this.closingFolderClassifications
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  /**
   * Επανάνοιγμα φακέλου
   */
  reopenInmateFolder() {
    this.confirmationService.confirm({
      message: this.translate.instant('inmate.folder.reopen.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.inmateService.reopenInmateFolder(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('inmate.folder.reopen.success'));
            
            // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
            this.inmateFolderForm.form.markAsPristine();
            this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
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
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  /**
   * ------------------------------------
   * Αποφάσεις
   * ------------------------------------
   */
  
  /**
   * Άνοιγμα και κλείσιμο accordion tab απόφασης
   */
  judgmentAccordionTabOpened(event) {
    this.judgmentActiveIndex = event.index;
  }
  judgmentAccordionTabClosed(event) {
    this.judgmentActiveIndex = -1;
  }
  
  /**
   * Το όνομα της απόφασης προς εμφάνιση
   */
  getJudgmentDisplayName(judgment) {
    if (!judgment.id) {
      return this.translate.instant('inmate.folder.judgment.new');
    }
    else {
      return this.translate.instant('inmate.folder.judgment') + ' ' + judgment.displayName;
    }
  }
  
  /**
   * Χρώμα για το header της απόφασης
   */
  getJudgmentHeaderColorClass(judgment) {
    if (judgment.id) {
      if (judgment.cancelled) {
        return 'color-red';
      }
      else if (judgment.merged) {
        return 'color-purple';
      }
      else if (judgment.completed) {
        return 'color-green';
      }
    }
  }
  
  /**
   * Οι αποφάσεις που έχουν τη δεδομένη ως σχετική
   */
  getJudgmentsHavingThisAsRelated(judgmentId) {
    let filteredJudgments = this.inmate.judgments.filter(item => {
      return (item.relatedJudgmentId === judgmentId);
    });
    
    return !filteredJudgments ? [] : filteredJudgments;
}

  /**
   * Εμφάνιση όλων / απόκρυψη ανενεργών αποφάσεων
   */
  toggleAllJudgments() {
    this.showAllJudgmentsChecked = !this.showAllJudgmentsChecked;
    
    this.inmate.judgments.forEach(judgment => {
      
      if (this.showAllJudgmentsChecked) {
        // Εμφάνιση όλων
        // -------------
        // Ορισμός isHidden = false σε όλες
        judgment.isHidden = false;
        // Ορισμός isChecked = true σε όσες είναι isRelated
        if (judgment.isRelated) {
          judgment.isChecked = true;
        }
      }
      else {
        // Απόκρυψη ανενεργών
        // ------------------
        // Ορισμός isHidden = true σε όσες είναι ακυρωμένες ή συγχωνευμένες
        if (judgment.cancelled || judgment.merged) {
          judgment.isHidden = true;
        }
        // Ορισμός isChecked = false σε όλες
        judgment.isChecked = false;
      }
    });
  }

  /**
   * Εμφάνιση / απόκρυψη σχετικών αποφάσεων για τη δεδομένη απόφαση
   */
  toggleRelatedJudgments(judgment, event) {
    judgment.isChecked = !judgment.isChecked;
    event.stopPropagation();
    
    // Οι αποφάσεις που έχουν αυτή ως σχετική
    let judgmentsHavingThisAsRelated = this.getJudgmentsHavingThisAsRelated(judgment.id);
    judgmentsHavingThisAsRelated.forEach(judgmentHavingThisAsRelated => {
      if (judgment.isChecked) {
        // Εμφάνιση
        judgmentHavingThisAsRelated.isHidden = false;
      }
      else {
        // Απόκρυψη
        judgmentHavingThisAsRelated.isHidden = true;
      }
    });
  }
  
  /**
   * Εισαγωγή νέας απόφασης
   */
  addNewJudgment() {
    this.inmate.judgments.push(new Judgment());
    this.judgmentActiveIndex = this.inmate.judgments.length - 1;
  }
  
  /**
   * Διαγραφή απόφασης
   */
  deleteJudgment(judgmentId, index, event) {
    event.stopPropagation();
    
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!judgmentId) {
          this.inmate.judgments.splice(index, 1);
          this.judgmentActiveIndex = -1;
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          
          this.judgmentService.deleteJudgment(judgmentId).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.inmate.judgments.splice(index, 1);
              this.judgmentActiveIndex = -1;
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
  
  /**
   * Αλλαγή τρέχουσας απόφασης
   */
  openChangeCurrentJudgmentDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(ChangeCurrentJudgmentDialogComponent, {
      header: this.translate.instant('judgment.changeCurrent.dialogTitle'),
      width: '40%',
      data: {
        inmateId: this.id,
        candidateJudgmentsToSetCurrent: this.candidateJudgmentsToSetCurrent
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }

  /**
   * Συγχώνευση αποφάσεων
   */
  openMergeJudgmentsDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(MergeJudgmentsDialogComponent, {
      header: this.translate.instant('judgment.merge.dialogTitle'),
      width: '40%',
      data: {
        inmateId: this.id,
        candidateJudgmentsToMerge: this.candidateJudgmentsToMerge,
        judgmentTypes: this.judgmentTypes,
        pJudgmentCategory: this.pJudgmentCategory,
        pFact: this.pFact,
        pSentence: this.pSentence
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  /**
   * Αποσυγχώνευση απόφασης
   */
  openUnmergeJudgmentDialog(judgment, event) {
    event.stopPropagation();
    
    // Οι συγχωνευμένες αποφάσεις που έχουν αυτή την απόφαση ως σχετική
    let mergedJudgmentsHavingThisAsRelated = this.inmate.judgments.filter(item => {
      return (item.merged && item.relatedJudgmentId === judgment.id);
    });
    
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(UnmergeJudgmentDialogComponent, {
      header: this.translate.instant('judgment.unmerge.dialogTitle') + ' ' + judgment.displayName,
      width: '40%',
      data: {
        inmateId: this.id,
        judgmentIdToUnmerge: judgment.id,
        willUnmergeCurrentJudgment: judgment.current,
        mergedJudgmentsHavingThisAsRelated: mergedJudgmentsHavingThisAsRelated,
        mergingJudgmentBeneficialCalculation: judgment.beneficialCalculation,
        mergingJudgmentBeneficialCalculationText: judgment.beneficialCalculationText
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  /**
   * Ακύρωση απόφασης
   */
  openCancelJudgmentDialog(judgment, event) {
    event.stopPropagation();
    
    // Οι υποψήφιες αποφάσεις προς ορισμό ως σχετικής
    // Είναι οι (αποθηκευμένες) μη ακυρωμένες, μη συγχωνευμένες και όχι η επιλεγμένη
    let candidateJudgmentsToSetAsRelated = this.inmate.judgments.filter(item => {
      return (item.id && !item.cancelled && !item.merged && item.id !== judgment.id);
    });
    
    // Οι υποψήφιες αποφάσεις προς ορισμό ως νέας τρέχουσας
    // Είναι οι (αποθηκευμένες) μη ακυρωμένες, μη συγχωνευμένες, μη εκτελεσθείσες, όχι η τρέχουσα και όχι η επιλεγμένη
    let candidateJudgmentsToSetCurrent = this.inmate.judgments.filter(item => {
      return (item.id && !item.cancelled && !item.merged && !item.completed && !item.current && item.id !== judgment.id);
    });
    
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CancelJudgmentDialogComponent, {
      header: this.translate.instant('judgment.cancel.dialogTitle') + ' ' + judgment.displayName,
      width: '40%',
      data: {
        inmateId: this.id,
        judgmentIdToCancel: judgment.id,
        willCancelCurrentJudgment: judgment.current,
        candidateJudgmentsToSetAsRelated: candidateJudgmentsToSetAsRelated,
        candidateJudgmentsToSetCurrent: candidateJudgmentsToSetCurrent,
        closingFolderClassifications: this.closingFolderClassifications
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  /**
   * Επαναφορά ακυρωμένης απόφασης
   */
  openRevertCancelledJudgmentDialog(judgment, event) {
    event.stopPropagation();
    
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(RevertCancelledJudgmentDialogComponent, {
      header: this.translate.instant('judgment.revertCancelled.dialogTitle') + ' ' + judgment.displayName,
      width: '40%',
      data: {
        inmateId: this.id,
        judgmentIdToRevert: judgment.id
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  /**
   * Μεταφορά ευεργετικών ημερομισθίων
   */
  openMoveBeneficialCalculationDialog(judgment, event) {
    event.stopPropagation();
    
    // Οι υποψήφιες αποφάσεις προς μεταφορά του ευεργετικού
    // Είναι οι (αποθηκευμένες) μη ακυρωμένες, μη συγχωνευμένες, μη εκτελεσθείσες και όχι η επιλεγμένη
    let candidateJudgmentsToMove = this.inmate.judgments.filter(item => {
      return (item.id && !item.cancelled && !item.merged && !item.completed && item.id !== judgment.id);
    });
    
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(MoveBeneficialCalculationDialogComponent, {
      header: this.translate.instant('judgment.moveBeneficialCalculation.dialogTitle') + ' ' + judgment.displayName,
      width: '40%',
      data: {
        inmateId: this.id,
        originJudgmentId: judgment.id,
        candidateJudgmentsToMove: candidateJudgmentsToMove,
        originJudgmentBeneficialCalculation: judgment.beneficialCalculation,
        originJudgmentBeneficialCalculationText: judgment.beneficialCalculationText
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  /**
   * ------------------------------------
   * Κρατήσεις
   * ------------------------------------
   */
  
  /**
   * Άνοιγμα και κλείσιμο accordion tab κράτησης
   */
  inmateRecordAccordionTabOpened(event) {
    this.inmateRecordActiveIndex = event.index;
  }
  inmateRecordAccordionTabClosed(event) {
    this.inmateRecordActiveIndex = -1;
  }
  
  /**
   * Το όνομα της κράτησης προς εμφάνιση
   */
  getInmateRecordDisplayName(inmateRecord, index) {
    if (!inmateRecord.id) {
      return this.translate.instant('inmate.folder.inmateRecord.new');
    }
    else {
      return this.translate.instant('inmate.folder.inmateRecord') + ' ' + (index + 1) + ' (' + inmateRecord.displayName + ')';
    }
  }
  
  /**
   * Εισαγωγή νέας κράτησης
   */
  addNewInmateRecord() {
    let inmateRecord = new InmateRecord();
    inmateRecord.dcId = this.authService.getUserDcId();
    inmateRecord.lastRecordDc = true;
    inmateRecord.lastRecord = true;
    inmateRecord.status = 'OPEN';
    inmateRecord.entryDate = this.dateService.getCurrentDateString() as unknown as Date;
    
    this.inmate.inmateRecords.push(inmateRecord);
    this.inmateRecordActiveIndex = this.inmate.inmateRecords.length - 1;
  }
  
  /**
   * Διαγραφή κράτησης
   */
  deleteInmateRecord(inmateRecordId, index, event) {
    event.stopPropagation();
    
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!inmateRecordId) {
          this.inmate.inmateRecords.splice(index, 1);
          this.inmateRecordActiveIndex = -1;
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          
          this.inmateRecordService.deleteInmateRecord(inmateRecordId).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.inmate.inmateRecords.splice(index, 1);
              this.inmateRecordActiveIndex = -1;
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

  /**
   * Κλείσιμο κράτησης
   */
  openCloseInmateRecordDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CloseInmateRecordDialogComponent, {
      header: this.translate.instant('inmateRecord.close.dialogTitle'),
      width: '40%',
      data: {
        inmateId: this.id,
        temporaryRecordExistsInDifferentDc: this.inmate.temporaryRecordExistsInDifferentDc,
        closingRecordClassifications: this.closingRecordClassifications
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  /**
   * Επανάνοιγμα κράτησης
   */
  reopenInmateRecord() {
    this.confirmationService.confirm({
      message: this.translate.instant('inmateRecord.reopen.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.inmateRecordService.reopenInmateRecord(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateRecord.reopen.success'));
            
            // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
            this.inmateFolderForm.form.markAsPristine();
            this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
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
  
  /**
   * Αλλαγή ποινικής κατάστασης
   */
  openChangeCriminalStatusDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(ChangeCriminalStatusDialogComponent, {
      header: this.translate.instant('inmateRecord.changeCriminalStatus.dialogTitle'),
      width: '80%',
      data: {
        inmateId: this.id,
        categoryOfOpenInmateRecordInUserDc: this.categoryOfOpenInmateRecordInUserDc,
        closingRecordClassifications: this.closingRecordClassifications,
        inmateRecordCategories: this.inmateRecordCategories,
        pCharacterization: this.pCharacterization,
        pDurationType: this.pDurationType,
        pDuration: this.pDuration,
        pEntryReason: this.pEntryReason
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateFolderForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/folder', this.id]); });
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  /**
   * ------------------------------------
   * Ένδικα Μέσα
   * ------------------------------------
   */
  
  /**
   * Εισαγωγή νέου ένδικου μέσου
   */
  addNewAppeal() {
    let appeal = new Appeal();
    appeal.inmateId = this.id;
    
    this.inmate.appeals.push(appeal);
  }
  
  /**
   * Διαγραφή ένδικου μέσου
   */
  deleteAppeal(appealId, index) {
    
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!appealId) {
          this.inmate.appeals.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          
          this.appealService.deleteAppeal(appealId).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.inmate.appeals.splice(index, 1);
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
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
