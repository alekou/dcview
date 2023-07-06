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
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {InmateService} from './inmate.service';
import {InmateRecordService} from '../inmate-record/inmate-record.service';
import {JudgmentService} from '../judgment/judgment.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {CountryService} from '../../sa/country/country.service';
import {CityService} from '../../sa/city/city.service';
import {Inmate} from './inmate.model';
import {CloseInmateFolderDialogComponent} from './close-inmate-folder-dialog/close-inmate-folder-dialog.component';
import {CloseInmateRecordDialogComponent} from '../inmate-record/close-inmate-record-dialog/close-inmate-record-dialog.component';
import {InmateRelativesComponent} from '../visitor/inmate-relatives/inmate-relatives.component';
import {InmateStatusService} from '../inmate-status/inmate-status-service';

@Component({
  selector: 'app-inm-inmate-view',
  templateUrl: 'inmate-view.component.html'
})
export class InmateViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  inmate: Inmate;
  @ViewChild(NgForm) inmateForm: NgForm;
  
  genders = [];
  ageCategories = [];
  pReligion = {};
  countries = [];
  homeCities = [];
  residenceCities = [];
  greekCities = [];
  pEducation = {};
  pForeignLanguage = {};
  pProfession = {};
  pNewEducationInside = {};
  pNewEducationOutside = {};
  pVerbalSkillGreek = {};
  pWrittenSkillGreek = {};
  maritalStatuses = [];
  pOtherMaritalStatus = {};
  pEyeColor = {};
  pHairColor = {};
  folderStatuses = [];
  pFolderOpeningReason = {};
  
  inmateRecordStatuses = [];
  inmateRecordCategories = [];
  pCharacterization = {};
  pDurationType = {};
  pDuration = {};
  pEntryReason = {};
  
  pDaOffice = {};
  judgmentTypes = [];
  pJudgmentCategory = {};
  pFact = {};
  pSentence = {};
  pSentenceFeeCurrency = {};
  pSequential = {};
  
  releaseTimeSentenceTotalsCollapsed = true;
  releaseTimeCalculationsCollapsed = true;
  
  releaseTimeSentenceTotals = null;
  releaseTimeCalculations = null;

  @ViewChild(InmateRelativesComponent) inmateRelativesComponent: InmateRelativesComponent;
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
    private dateService: DateService,
    private inmateService: InmateService,
    private inmateRecordService: InmateRecordService,
    private judgmentService: JudgmentService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService,
    private countryService: CountryService,
    private cityService: CityService,
    private inmateStatusService: InmateStatusService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.inmate = this.id ? this.route.snapshot.data['record'] : new Inmate();
    
    // Get the lists
    this.enumService.getEnumValues('cm.core.enums.Gender').subscribe(responseData => {
      this.genders = responseData;
    });
    this.enumService.getEnumValues('cm.core.enums.AgeCategory').subscribe(responseData => {
      this.ageCategories = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Religion, [this.inmate.religionPid]).subscribe(responseData => {
      this.pReligion = responseData;
    });
    this.countryService.getCountries(true, [this.inmate.nationalityMainId]).subscribe(responseData => {
      this.countries = responseData;
      this.getHomeCities();
      this.getResidenceCities();
    });
    this.cityService.getGreekCities(true, [this.inmate.judgment.daOfficeCityId]).subscribe(responseData => {
      this.greekCities = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Education, [this.inmate.educationPid]).subscribe(responseData => {
      this.pEducation = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_ForeignLanguage, [this.inmate.foreignLanguagePid]).subscribe(responseData => {
      this.pForeignLanguage = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_Profession, [this.inmate.professionPid]).subscribe(responseData => {
      this.pProfession = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_NewEducationInside, [this.inmate.newEducationInsidePid]).subscribe(responseData => {
      this.pNewEducationInside = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_NewEducationOutside, [this.inmate.newEducationOutsidePid]).subscribe(responseData => {
      this.pNewEducationOutside = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_VerbalSkillGreek, [this.inmate.verbalSkillGreekPid]).subscribe(responseData => {
      this.pVerbalSkillGreek = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_WrittenSkillGreek, [this.inmate.writtenSkillGreekPid]).subscribe(responseData => {
      this.pWrittenSkillGreek = responseData;
    });
    this.enumService.getEnumValues('cm.core.enums.MaritalStatus').subscribe(responseData => {
      this.maritalStatuses = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_OtherMaritalStatus, [this.inmate.otherMaritalStatusPid]).subscribe(responseData => {
      this.pOtherMaritalStatus = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_EyeColor, [this.inmate.eyeColorPid]).subscribe(responseData => {
      this.pEyeColor = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_HairColor, [this.inmate.hairColorPid]).subscribe(responseData => {
      this.pHairColor = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.InmateFolderStatus').subscribe(responseData => {
      this.folderStatuses = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Inmate_FolderOpeningReason, [this.inmate.folderOpeningReasonPid]).subscribe(responseData => {
      this.pFolderOpeningReason = responseData;
    });
    
    this.enumService.getEnumValues('inm.core.enums.InmateRecordStatus').subscribe(responseData => {
      this.inmateRecordStatuses = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.InmateRecordCategory').subscribe(responseData => {
      this.inmateRecordCategories = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_Characterization, [this.inmate.inmateRecord.characterizationPid]).subscribe(responseData => {
      this.pCharacterization = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_DurationType, [this.inmate.inmateRecord.durationTypePid]).subscribe(responseData => {
      this.pDurationType = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_Duration, [this.inmate.inmateRecord.durationPid]).subscribe(responseData => {
      this.pDuration = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_EntryReason, [this.inmate.inmateRecord.entryReasonPid]).subscribe(responseData => {
      this.pEntryReason = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_DaOffice, [this.inmate.judgment.daOfficePid]).subscribe(responseData => {
      this.pDaOffice = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.JudgmentType').subscribe(responseData => {
      this.judgmentTypes = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Category, [this.inmate.judgment.categoryPid]).subscribe(responseData => {
      this.pJudgmentCategory = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Fact, [this.inmate.judgment.factPid]).subscribe(responseData => {
      this.pFact = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Sentence, [this.inmate.judgment.sentencePid]).subscribe(responseData => {
      this.pSentence = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_SentenceFeeCurrency, [this.inmate.judgment.sentenceFeeCurrencyPid]).subscribe(responseData => {
      this.pSentenceFeeCurrency = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Sequential, [this.inmate.judgment.sequentialPid]).subscribe(responseData => {
      this.pSequential = responseData;
    });
    
    if (!this.id) {
      this.inmate.folderStatus = 'OPEN';
      this.inmate.folderOpeningDate = this.dateService.getCurrentDateString() as unknown as Date;
      this.inmate.inmateRecord.status = 'OPEN';
      this.inmate.inmateRecord.entryDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    
    if (this.id) {
      // Προβολή πληροφοριών τρέχουσας κατάστασης (παρουσία/απουσία/κατάσταση κράτησης/κατάσταση φακέλου) του κρατουμένου, σε toast
      this.inmateStatusService.showInmateStatusToast(this.inmate);
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.inmateForm.dirty;
  }
  
  goToOldList() {
    this.router.navigate(['/inm/inmate/oldlist']);
  }
  
  goToList() {
    this.router.navigate(['/inm/inmate/list']);
  }
  
  goToFolder() {
    this.router.navigate(['/inm/inmate/folder', this.id]);
  }
  
  /**
   * Συνθήκη κλειδώματος όλου του κρατουμένου
   */
  lockedInmate() {
    
    // Υπουργείο -> ο κρατούμενος είναι κλειδωμένος
    if (this.authService.isMinistry()) {
      return true;
    }
    
    // Ο νέος κρατούμενος είναι επεξεργάσιμος
    if (!this.id) {
      return false;
    }
    
    // Αν ο φάκελος είναι κλειστός, ο κρατούμενος είναι κλειδωμένος
    if (this.inmate.folderStatus === 'CLOSED') {
      return true;
    }
    
    // Κατάστημα -> χρησιμοποιείται η συνθήκη που έρχεται από το api
    // (να υπάρχει στο κατάστημα του χρήστη κράτηση ενεργη/αδυναμια ή κράτηση με lastRecord = 1
    // και να μην υπάρχει ανοιχτή/αδυναμία αλλού)
    return !this.inmate.canEditInmate;
  }
  
  /**
   * Συνθήκη κλειδώματος της κράτησης
   */
  lockedInmateRecord() {
    
    // Υπουργείο -> η κράτηση είναι κλειδωμένη
    if (this.authService.isMinistry()) {
      return true;
    }
    
    // Η νέα κράτηση είναι επεξεργάσιμη
    if (!this.inmate.inmateRecord.id) {
      return false;
    }
    
    if (this.inmate.inmateRecord.status === 'CLOSED') {
      // Αν είναι κλειστή, είναι κλειδωμένη
      return true;
    }
    else if (this.inmate.inmateRecord.dcId === this.authService.getUserDcId()) {
      // Αν είναι ενεργή (ανοιχτή/αδυναμία/προσωρινή) και στο κατάστημα του χρήστη, είναι επεξεργάσιμη
      return false;
    }
    
    return true;
  }
  
  /**
   * Αποθήκευση
   */
  saveInmate() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.inmateService.saveInmate(this.inmate).subscribe({
      next: (responseData: Inmate) => {
        this.toitsuToasterService.showSuccessStay();
        this.inmateForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/inmate/view', responseData.id]);
        }
        else {
          this.inmate = responseData;
          this.resetReleaseTimePanels();
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  /**
   * Διαγραφή
   */
  deleteInmate() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.inmateService.deleteInmate(this.inmate.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.inmateForm.form.markAsPristine();
            this.router.navigate(['/inm/inmate/list']);
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
   * Κλείσιμο φακέλου
   */
  openCloseInmateFolderDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CloseInmateFolderDialogComponent, {
      header: this.translate.instant('inmate.folder.close.dialogTitle'),
      width: '40%',
      data: {
        inmateId: this.id
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/view', this.id]); });
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
            this.inmateForm.form.markAsPristine();
            this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/view', this.id]); });
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
   * Κλείσιμο κράτησης
   */
  openCloseInmateRecordDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CloseInmateRecordDialogComponent, {
      header: this.translate.instant('inmateRecord.close.dialogTitle'),
      width: '40%',
      data: {
        inmateId: this.id,
        temporaryRecordExistsInDifferentDc: this.inmate.temporaryRecordExistsInDifferentDc
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Στην επιτυχία γίνεται ξανά φόρτωση της σελίδας
        this.inmateForm.form.markAsPristine();
        this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/view', this.id]); });
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
            this.inmateForm.form.markAsPristine();
            this.router.navigate(['/']).then(() => { this.router.navigate(['/inm/inmate/view', this.id]); });
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
   * Μετάβασε σε λίστα με έτοιμο κριτήριο τον κρατούμενο του view
   */
  goToRelatedRecordList(entity){
    let args = {
      inmateId: this.id
    };
    this.toitsuTableService.storeArgsAndRemovePagingFromLocalStorage('/inm/' + entity + '/list', args);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/inm/' + entity + '/list'])
    );
    window.open(url, '_blank');
  }
  
  /**
   * Φόρτωση συγγενών κρατουμένου
   */
  loadInmateRelatives() {
    this.inmateRelativesComponent.getInmateRelatives();
    this.inmateRelativesComponent.getInmateOtherRelatives();
  }
  
  /**
   * Διαχείριση των πόλεων βάσει χώρας
   */
  getHomeCities() {
    if (this.inmate.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.inmate.homeCountryId, true, [this.inmate.homeCityId]).subscribe(responseData => {
        this.homeCities = responseData;
      });
    }
    else {
      this.homeCities = [];
    }
  }
  
  getResidenceCities() {
    if (this.inmate.residenceCountryId) {
      this.cityService.getCitiesByCountryId(this.inmate.residenceCountryId, true, [this.inmate.residenceCityId]).subscribe(responseData => {
        this.residenceCities = responseData;
      });
    }
    else {
      this.residenceCities = [];
    }
  }
  
  homeCountryIdChanged() {
    this.inmate.homeCityId = null;
    this.getHomeCities();
  }
  
  residenceCountryIdChanged() {
    this.inmate.residenceCityId = null;
    this.getResidenceCities();
  }
  
  /**
   * Σύνολο Ποινών και Υπολογισμοί - κλείσιμο των panels και μηδενισμός των δεδομένων
   */
  resetReleaseTimePanels() {
    this.releaseTimeSentenceTotalsCollapsed = true;
    this.releaseTimeCalculationsCollapsed = true;
    
    this.releaseTimeSentenceTotals = null;
    this.releaseTimeCalculations = null;
  }
  
  /**
   * Ανάκτηση των δεδομένων για το σύνολο ποινών
   */
  getReleaseTimeSentenceTotals() {
    // Αν δεν έχουν ήδη φορτωθεί τα δεδομένα
    if (!this.releaseTimeSentenceTotals) {
      this.judgmentService.getReleaseTimeSentenceTotals(this.id).subscribe(responseData => {
        this.releaseTimeSentenceTotals = responseData;
      });
    }
  }
  
  /**
   * Ανάκτηση των δεδομένων για τους υπολογισμούς
   */
  getReleaseTimeCalculations() {
    // Αν δεν έχουν ήδη φορτωθεί τα δεδομένα
    if (!this.releaseTimeCalculations) {
      
    }
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

}
