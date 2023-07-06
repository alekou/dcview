import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {DialogService} from 'primeng/dynamicdialog';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {DateService} from '../../toitsu-shared/date.service';
import {Hearing} from './hearing.model';
import {TreatmentService} from '../treatment/treatment.service';
import {BloodSamplingService} from '../blood-sampling/blood-sampling.service';
import {VaccinationService} from '../vaccination/vaccination.service';
import {ExaminationService} from '../examination/examination.service';
import {ExaminationTypeService} from '../examination-type/examination-type.service';
import {HearingApplicationService} from '../hearing-application/hearing-application.service';
import {EnumService} from '../../cm/enum/enum.service';
import {HearingService} from './hearing.service';
import {DiseaseViewDialogComponent} from '../disease/disease-view-dialog/disease-view-dialog.component';
import {DiseaseService} from '../disease/disease.service';
import {Disease} from '../disease/disease.model';
import {ExaminationViewDialogComponent} from '../examination/examination-view-dialog/examination-view-dialog.component';
import {Examination} from '../examination/examination.model';
import {ExaminationTypeListDialogComponent} from '../examination-type/examination-type-list-dialog/examination-type-list-dialog.component';
import {BloodSamplingViewDialogComponent} from '../blood-sampling/blood-sampling-view-dialog/blood-sampling-view-dialog.component';
import {BloodSampling} from '../blood-sampling/blood-sampling.model';
import {VaccinationViewDialogComponent} from '../vaccination/vaccination-view-dialog/vaccination-view-dialog.component';
import {Vaccination} from '../vaccination/vaccination.model';
import {Treatment} from '../treatment/treatment.model';
import {TreatmentViewDialogComponent} from '../treatment/treatment-view-dialog/treatment-view-dialog.component';
import {HearingTypeService} from '../hearing-type/hearing-type.service';
import {bloodSamplingConsts} from '../blood-sampling/blood-sampling.consts';
import {diseaseConsts} from '../disease/disease.consts';
import {examinationConsts} from '../examination/examination.consts';
import {vaccinationConsts} from '../vaccination/vaccination.consts';
import {treatmentConsts} from '../treatment/treatment.consts';
import {hearingConsts} from './hearing.consts';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-med-hearing-view',
  templateUrl: 'hearing-view.component.html'
})
export class HearingViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) hearingForm: NgForm;
  id: number;
  hearing: Hearing = new Hearing();
  inmateDialogUrl: string;
  activeDoctors = [];
  hearingApplications = [];
  hearingTypes = [];
  injuryReasons = [];

  constructor(
    private hearingService: HearingService,
    private diseaseService: DiseaseService,
    private treatmentService: TreatmentService,
    private bloodSamplingService: BloodSamplingService,
    private vaccinationService: VaccinationService,
    private examinationService: ExaminationService,
    private examinationTypeService: ExaminationTypeService,
    private doctorService: DoctorService,
    private hearingApplicationService: HearingApplicationService,
    private hearingTypeService: HearingTypeService,
    public authService: AuthService,
    private enumService: EnumService,
    private dialogService: DialogService,
    private dateService: DateService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.hearing = this.id ? this.route.snapshot.data['record'] : new Hearing();
    
    if (this.id) {
      this.hearingApplicationService.getAllHearingApplicationsByInmateId(this.hearing.inmateId).subscribe(responseData => {
        this.hearingApplications = responseData;
      });
    }
    
    if (!this.id) {
      this.hearing.hearingDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
      this.hearing.inmateId = +this.route.snapshot.queryParamMap.get('inmateId') ? +this.route.snapshot.queryParamMap.get('inmateId') : null;
    }
    
    this.clearBloodSamplingArgs();
    this.clearDiseaseArgs();
    this.clearExaminationArgs();
    this.clearVaccinationArgs();
    this.clearTreatmentArgs();
    this.clearHearingArgs();
    
    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    this.doctorService.getAllActiveDoctors().subscribe(activeDoctors => {
      this.activeDoctors = activeDoctors;
    });
    
    // Τύποι Ακρόασης
    this.hearingTypeService.getAllHearingTypes('MED', true, [this.hearing.hearingTypeId]).subscribe(responseData => {
      this.hearingTypes = responseData;
    });
    // Αιτία τραυματισμού
    this.enumService.getEnumValues('med.core.enums.InjuryKind').subscribe(responseData => {
      this.injuryReasons = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.hearingForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/hearing/view']);
  }

  goToList() {
    this.router.navigate(['/med/hearing/list']);
  }

  saveHearing() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.hearingService.saveHearing(this.hearing).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.hearingForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/hearing/view/', responseData.id]);
        } else {
          this.hearing = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteHearing() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.hearingService.deleteHearing(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.hearingForm.form.markAsPristine();
            this.router.navigate(['/med/hearing/list']);
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

  hearingApplicationChanged() {
    this.hearingApplicationService.getAllHearingApplicationsByInmateId(this.hearing.inmateId).subscribe(responseData => {
      this.hearingApplications = responseData;
    });
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.hearing.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
  
  // Παθήσεις ----------------------------------------------------------------------------------

  diseaseUrl = diseaseConsts.indexUrl;
  diseaseCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'diseaseTypeDescription', header: this.translate.instant('disease.diseaseTypeId'), sortField: 'med/QDiseaseType.diseaseType.description', width: '35rem', align: 'center'},
    {field: 'diagnosisDate', header: this.translate.instant('disease.diagnosisDate'), sortField: 'diagnosisDate', width: '15rem', align: 'center'},
    {field: 'progression', header: this.translate.instant('disease.progression'), sortField: 'progression', width: '10rem', align: 'center'},
    {field: 'chronicOption', header: this.translate.instant('disease.isChronic'), sortField: 'isChronic', width: '10rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  diseaseSortField = 'diagnosisDate';
  diseaseSortOrder = 1;
  diseaseArgs = this.initializeDiseaseArgs();

  @ViewChild('diseaseTable') diseaseTable;

  initializeDiseaseArgs() {
    return {
      inmateId: null,
      diseaseDescription: null,
      fromDiagnosisDate: null,
      toDiagnosisDate: null,
      hearingId: this.hearing.id
    };
  }
  loadDiseaseTableData() {
    this.diseaseTable.loadTableData();
  }
  clearDiseaseArgs() {
    this.diseaseArgs = this.initializeDiseaseArgs();
  }
  openDiseaseDialogForCreate() {
    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      let disease: Disease = new Disease();
      disease.inmateId = this.hearing.inmateId;
      disease.hearingId = this.hearing.id;
      const diseaseViewDialog = this.dialogService.open(DiseaseViewDialogComponent, {
        data: {
         disease: disease
        },
        header: this.translate.instant('disease.dialog.title'),
        width: '50%'
      });

      diseaseViewDialog.onClose.subscribe(result => {
       this.loadDiseaseTableData();
      });
    }
  }

  openDiseaseDialogForEdit(rowData) {
    
    this.diseaseService.getDisease(rowData.id).subscribe(disease => {

      const diseaseViewDialog = this.dialogService.open(DiseaseViewDialogComponent, {
        data: {
          disease: disease
        },
        header: this.translate.instant('disease.dialog.title'),
        width: '50%'
      });

      diseaseViewDialog.onClose.subscribe(result => {
       this.loadDiseaseTableData();
      });
    });
  }
  deleteDisease(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.diseaseService.deleteDisease(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadDiseaseTableData();
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
  
  // Εξετάσεις ----------------------------------------------------------------------------------
  
  examinationUrl = examinationConsts.indexUrl;
  examinationCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'fullDescription', header: this.translate.instant('examination.examinationTypeCategory'), width: '25rem', align: 'center'},
    {field: 'examinationDate', header: this.translate.instant('examination.examinationDate'), sortField: 'examinationDate', width: '25rem', align: 'center'},
    {field: 'results', header: this.translate.instant('examination.results'), sortField: 'results', width: '25rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  examinationSortField = 'examinationDate';
  examinationSortOrder = 1;
  examinationArgs = this.initializeExaminationArgs();

  @ViewChild('examinationTable') examinationTable;

  initializeExaminationArgs() {
    return {
      inmateId: null,
      fromTestDate: null,
      toTestDate: null,
      examinationTypeCategory: null,
      hearingId: this.hearing.id
    };
  }
  loadExaminationTableData() {
    this.examinationTable.loadTableData();
  }
  clearExaminationArgs() {
    this.examinationArgs = this.initializeExaminationArgs();
  }
  
  openExaminationDialogForCreate() {
    
    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      let examination: Examination = new Examination();
      examination.hearingId = this.hearing.id;
      examination.inmateId = this.hearing.inmateId;
      const examinationViewDialog = this.dialogService.open(ExaminationViewDialogComponent, {
        data: {
          examination: examination
        },
        header: this.translate.instant('examination.dialog.title'),
        width: '55%'
      });

      examinationViewDialog.onClose.subscribe(result => {
       this.loadExaminationTableData();
      });
    }
  }

  openExaminationDialogForEdit(rowData) {
    this.examinationService.getExamination(rowData.id).subscribe(examination => {
      
      const examinationViewDialog = this.dialogService.open(ExaminationViewDialogComponent, {
        data: {
          examination: examination
        },
        header: this.translate.instant('examination.dialog.title'),
        width: '55%'
      });

      examinationViewDialog.onClose.subscribe(result => {
        this.loadExaminationTableData();
      });
    });
  }

  openExaminationTypeListDialog() {

    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      const examinationTypeListDialog = this.dialogService.open(ExaminationTypeListDialogComponent, {
        data: {
          hearingId: this.hearing.id,
          inmateId: this.hearing.inmateId
        },
        header: this.translate.instant('examinationTypeList.dialogTitle'),
        width: '90%'
      });

      examinationTypeListDialog.onClose.subscribe(result => {
        this.loadExaminationTableData();
      });
    }
  }
  deleteExamination(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.examinationService.deleteExamination(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadExaminationTableData();
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
  
  // Αιμοληψίες ----------------------------------------------------------------------------------
  
  bloodSamplingUrl = bloodSamplingConsts.indexUrl;
  bloodSamplingCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'samplingDate', header: this.translate.instant('bloodSampling.samplingDate'), sortField: 'samplingDate', width: '20rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('bloodSampling.comments'), sortField: 'comments', width: '20rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  bloodSamplingSortField = 'samplingDate';
  bloodSamplingSortOrder = 1;
  bloodSamplingArgs = this.initializeBloodSamplingArgs();

  @ViewChild('bloodSamplingTable') bloodSamplingTable;

  initializeBloodSamplingArgs() {
   return {
     inmateId: null,
     fromSamplingDate: null,
     toSamplingDate: null,
     hearingId: this.hearing.id
   };
  }
  loadBloodSamplingTableData() {
    this.bloodSamplingTable.loadTableData();
  }
  clearBloodSamplingArgs() {
    this.bloodSamplingArgs = this.initializeBloodSamplingArgs();
  }
  
  openBloodSamplingViewDialogDialogForCreate() {
    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      let bloodSampling = new BloodSampling();
      bloodSampling.hearingId = this.hearing.id;
      bloodSampling.inmateId = this.hearing.inmateId;
      const bloodSamplingViewDialog = this.dialogService.open(BloodSamplingViewDialogComponent, {
        data: {
         bloodSampling: bloodSampling
        },
        header: this.translate.instant('bloodSampling.dialog.title'),
        width: '90%'
      });

      bloodSamplingViewDialog.onClose.subscribe(result => {
        this.loadBloodSamplingTableData();
      });
    }
  }

  openBloodSamplingViewDialogDialogForEdit(rowData) {

    this.bloodSamplingService.getBloodSampling(rowData.id).subscribe(bloodSampling => {
      const bloodSamplingViewDialog = this.dialogService.open(BloodSamplingViewDialogComponent, {
        data: {
          bloodSampling: bloodSampling
        },
        header: this.translate.instant('bloodSampling.dialog.title'),
        width: '90%'
      });
      
      bloodSamplingViewDialog.onClose.subscribe(result => {
        this.loadBloodSamplingTableData();
      });
    });
  }
  deleteBloodSampling(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.bloodSamplingService.deleteBloodSampling(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadBloodSamplingTableData();
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
  
  // Εμβολιασμοί ----------------------------------------------------------------------------------
  
  vaccinationUrl = vaccinationConsts.indexUrl;
  vaccinationCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'vaccineDescription', header: this.translate.instant('vaccination.vaccineDescription'), sortField: 'med/QVaccine.vaccine.description', width: '15rem'},
    {field: 'currentDose', header: this.translate.instant('vaccination.currentDose'), sortField: 'currentDose', width: '10rem', align: 'center'},
    {field: 'scheduledDate', header: this.translate.instant('vaccination.scheduledDate'), sortField: 'scheduledDate', width: '10rem', align: 'center'},
    {field: 'status', header: this.translate.instant('vaccination.vaccinationStatus'), sortField: 'vaccinationStatus', width: '10rem', align: 'center'},
    {field: 'vaccinationDate', header: this.translate.instant('vaccination.vaccinationDate'), sortField: 'vaccinationDate', width: '10rem', align: 'center'},
    {field: 'cancelReason', header: this.translate.instant('vaccination.cancelReason'), sortField: 'cancelReason', width: '20rem'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  vaccinationSortField = 'currentDose';
  vaccinationSortOrder = 1;
  vaccinationArgs = this.initializeVaccinationArgs();

  @ViewChild('vaccinationTable') vaccinationTable;

  initializeVaccinationArgs() {
    return {
      inmateId: null,
      vaccineDescription: null,
      fromScheduledDate: null,
      toScheduledDate: null,
      fromVaccinationDate: null,
      toVaccinationDate: null,
      vaccinationStatus: null,
      hearingId: this.hearing.id
    };
  }
  loadVaccinationTableData() {
    this.vaccinationTable.loadTableData();
  }
  clearVaccinationArgs() {
    this.vaccinationArgs = this.initializeVaccinationArgs();
  }
  
  openVaccinationViewDialogDialogForCreate() {

    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      let vaccination: Vaccination = new Vaccination();
      vaccination.hearingId = this.hearing.id;
      vaccination.inmateId = this.hearing.inmateId;
      const vaccinationViewDialog = this.dialogService.open(VaccinationViewDialogComponent, {
        data: {
          vaccination: vaccination,
        },
        header: this.translate.instant('vaccination.dialog.title'),
        width: '50%'
      });

      vaccinationViewDialog.onClose.subscribe(result => {
        this.loadVaccinationTableData();
      });
    }
  }
  openVaccinationViewDialogDialogForEdit(rowData) {
    this.vaccinationService.getVaccination(rowData.id).subscribe(vaccination => {

      const vaccinationViewDialog = this.dialogService.open(VaccinationViewDialogComponent, {
        data: {
          vaccination: vaccination,
        },
        header: this.translate.instant('vaccination.dialog.title'),
        width: '50%'
      });

      vaccinationViewDialog.onClose.subscribe(result => {
        this.loadVaccinationTableData();
      });
    });
  }

  deleteVaccination(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vaccinationService.deleteVaccination(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadVaccinationTableData();
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

  // Αγωγές ---------------------------------------------------------------------------------------
  
  treatmentUrl = treatmentConsts.indexUrl;
  treatmentCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'serialNo', header: this.translate.instant('treatment.serialNo'), sortField: 'serialNo', width: '12rem', align: 'center'},
    {field: 'treatmentDate', header: this.translate.instant('treatment.treatmentDate'), sortField: 'treatmentDate', width: '15rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('treatment.doctorId'), sortField: 'doctorId', width: '15rem', align: 'center'},
    {field: 'treatmentStatus', header: this.translate.instant('treatment.active'), sortField: 'stop', width: '12rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  treatmentSortField = 'serialNo';
  treatmentSortOrder = 1;
  treatmentArgs = this.initializeTreatmentArgs();

  @ViewChild('treatmentTable') treatmentTable;

  initializeTreatmentArgs() {
    return {
      inmateId: null,
      doctorId: null,
      fromDate: null,
      toDate: null,
      treatmentStatusOption: null,
      medicineTypeOption: null,
      medicineId: null,
      hearingId: this.hearing.id
    };
  }
  loadTreatmentTableData() {
    this.treatmentTable.loadTableData();
  }
  clearTreatmentArgs() {
    this.treatmentArgs = this.initializeTreatmentArgs();
  }
  
  openTreatmentViewDialogDialogForCreate() {
    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      let treatment: Treatment = new Treatment();
      treatment.hearingId = this.hearing.id;
      treatment.inmateId = this.hearing.inmateId;
      const treatmentViewDialog = this.dialogService.open(TreatmentViewDialogComponent, {
        data: {
          treatment: treatment,
        },
        header: this.translate.instant('treatment.dialog.title'),
        width: '90%'
      });

      treatmentViewDialog.onClose.subscribe(result => {
        this.loadTreatmentTableData();
      });
    }
  }

  openTreatmentViewDialogDialogForEdit(rowData) {
    this.treatmentService.getTreatment(rowData.id).subscribe(treatment => {

      const treatmentViewDialog = this.dialogService.open(TreatmentViewDialogComponent, {
        data: {
          treatment: treatment,
        },
        header: this.translate.instant('treatment.dialog.title'),
        width: '90%'
      });

      treatmentViewDialog.onClose.subscribe(result => {
        this.loadTreatmentTableData();
      });
    });
  }

  deleteTreatment(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.treatmentService.deleteTreatment(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadTreatmentTableData();
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
  
  // Ακροάσεις ------------------------------------------------------------------------------------

  hearingUrl = hearingConsts.indexUrl;
  hearingCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'hearingDate', header: this.translate.instant('hearing.hearingDate'), sortField: 'hearingDate', width: '15rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('hearing.doctorId'), sortField: 'doctorId', width: '15rem', align: 'center'},
    {field: 'reviewHearingOption', header: this.translate.instant('hearing.reviewHearing'), sortField: 'reviewHearing', width: '10rem', align: 'center'},
    {field: 'reviewDate', header: this.translate.instant('hearing.reviewDate'), sortField: 'reviewDate', width: '15rem', align: 'center'},
  ];
  hearingSortField = 'hearingDate';
  hearingSortOrder = 1;
  hearingArgs = this.initializeHearingArgs();

  @ViewChild('hearingTable') hearingTable;

  initializeHearingArgs() {
    return {
      inmateId: this.hearing.inmateId,
      doctorId: null,
    };
  }
  clearHearingArgs() {
    this.hearingArgs = this.initializeHearingArgs();
  }
}
