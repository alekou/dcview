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
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {CountryService} from '../../sa/country/country.service';
import {CityService} from '../../sa/city/city.service';
import {Inmate} from './inmate.model';
import {InmateRecord} from '../inmate-record/inmate-record.model';

@Component({
  selector: 'app-inm-inmate-old-view',
  templateUrl: 'inmate-old-view.component.html'
})
export class InmateOldViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  inmate: Inmate;
  @ViewChild(NgForm) inmateForm: NgForm;
  
  previousInmate: Inmate = new Inmate();
  previousInmateRecord: InmateRecord = new InmateRecord();
  
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
  folderOpeningReasons = [];
  
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
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService,
    private countryService: CountryService,
    private cityService: CityService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver
    this.inmate = this.route.snapshot.data['record'];
    
    // Τα προηγούμενα στοιχεία φακέλου
    this.previousInmate.folderSerialNo = this.inmate.folderSerialNo;
    this.previousInmate.folderStatus = this.inmate.folderStatus;
    this.previousInmate.folderOpeningDate = this.inmate.folderOpeningDate;
    this.previousInmate.folderOpeningReasonPid = this.inmate.folderOpeningReasonPid;
    this.previousInmate.folderEuroWarrant = this.inmate.folderEuroWarrant;
    
    // Η προηγούμενη τελευταία κράτηση
    this.previousInmateRecord = Object.assign({}, this.inmate.inmateRecord);
    
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
      this.folderOpeningReasons = responseData['genParameters'];
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
    
    // Αν ο φάκελος ήταν κλειστός, αρχικοποιούμε τα στοιχεία για το νέο φάκελο
    if (this.previousInmate.folderStatus === 'CLOSED') {
      this.inmate.folderSerialNo = null;
      this.inmate.folderStatus = 'OPEN';
      this.inmate.folderOpeningDate = this.dateService.getCurrentDateString() as unknown as Date;
      this.inmate.folderOpeningReasonPid = null;
      this.inmate.folderEuroWarrant = false;
    }
    
    // Αρχικοποιούμε τα στοιχεία για τη νέα κράτηση
    this.inmate.inmateRecord = new InmateRecord(); // Επαναδημιουργείται προκειμένου να καθαριστούν οι τιμές από την προηγούμενη τελευταία κράτηση
    this.inmate.inmateRecord.status = 'OPEN';
    this.inmate.inmateRecord.entryDate = this.dateService.getCurrentDateString() as unknown as Date;
    
    if (this.previousInmate.folderStatus === 'OPEN') {
      // Αν ο φάκελος ήταν ανοιχτός, αντιγράφονται στη νέα κράτηση κάποια στοιχεία από την προηγούμενη τελευταία κράτηση
      this.inmate.inmateRecord.category = this.previousInmateRecord.category;
      this.inmate.inmateRecord.characterizationPid = this.previousInmateRecord.characterizationPid;
      this.inmate.inmateRecord.durationTypePid = this.previousInmateRecord.durationTypePid;
      this.inmate.inmateRecord.durationPid = this.previousInmateRecord.durationPid;
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.inmateForm.dirty;
  }
  
  goToOldList() {
    this.router.navigate(['/inm/inmate/oldlist']);
  }
  
  /**
   * Αποδοχή παλιού κρατουμένου (αποθήκευση)
   */
  acceptOldInmate() {
    let confirmationMessage = null;
    let successMessage = null;
    
    if (this.previousInmate.folderStatus === 'CLOSED') {
      confirmationMessage = this.translate.instant('inmate.viewOld.acceptOldInmate.closedFolder.confirmation');
      successMessage = this.translate.instant('inmate.viewOld.acceptOldInmate.closedFolder.success');
    }
    else {
      confirmationMessage = this.translate.instant('inmate.viewOld.acceptOldInmate.openFolder.confirmation');
      successMessage = this.translate.instant('inmate.viewOld.acceptOldInmate.openFolder.success');
    }
    
    this.confirmationService.confirm({
      message: confirmationMessage,
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.inmateService.acceptOldInmate(this.inmate).subscribe({
          next: (responseData: Inmate) => {
            this.toitsuToasterService.showSuccessStay(successMessage);
            this.inmateForm.form.markAsPristine();
            this.router.navigate(['/inm/inmate/view', responseData.id]);
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
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

}
