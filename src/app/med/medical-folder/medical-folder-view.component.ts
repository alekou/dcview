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
import {InmateService} from '../../inm/inmate/inmate.service';
import {TreatmentService} from '../treatment/treatment.service';
import {BloodSamplingService} from '../blood-sampling/blood-sampling.service';
import {VaccinationService} from '../vaccination/vaccination.service';
import {ExaminationService} from '../examination/examination.service';
import {DiseaseViewDialogComponent} from '../disease/disease-view-dialog/disease-view-dialog.component';
import {DiseaseService} from '../disease/disease.service';
import {Disease} from '../disease/disease.model';
import {ExaminationViewDialogComponent} from '../examination/examination-view-dialog/examination-view-dialog.component';
import {Examination} from '../examination/examination.model';
import {BloodSamplingViewDialogComponent} from '../blood-sampling/blood-sampling-view-dialog/blood-sampling-view-dialog.component';
import {BloodSampling} from '../blood-sampling/blood-sampling.model';
import {VaccinationViewDialogComponent} from '../vaccination/vaccination-view-dialog/vaccination-view-dialog.component';
import {Vaccination} from '../vaccination/vaccination.model';
import {Treatment} from '../treatment/treatment.model';
import {TreatmentViewDialogComponent} from '../treatment/treatment-view-dialog/treatment-view-dialog.component';
import {bloodSamplingConsts} from '../blood-sampling/blood-sampling.consts';
import {diseaseConsts} from '../disease/disease.consts';
import {examinationConsts} from '../examination/examination.consts';
import {vaccinationConsts} from '../vaccination/vaccination.consts';
import {treatmentConsts} from '../treatment/treatment.consts';
import {Inmate} from '../../inm/inmate/inmate.model';
import {hearingConsts} from '../hearing/hearing.consts';
import {HearingService} from '../hearing/hearing.service';
import {doctorInmateConsts} from '../doctor-inmate/doctor-inmate.consts';
import {DoctorInmate} from '../doctor-inmate/doctor-inmate.model';
import {DoctorInmateViewDialogComponent} from '../doctor-inmate/doctor-inmate-view-dialog.component';
import {DoctorInmateService} from '../doctor-inmate/doctor-inmate.service';

@Component({
  selector: 'app-med-medical-folder-view',
  templateUrl: 'medical-folder-view.component.html'
})
export class MedicalFolderViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) medicalFolderForm: NgForm;
  id: number;
  inmate: Inmate = new Inmate();
  doctorInmate: DoctorInmate = new DoctorInmate();
  constructor(
    private diseaseService: DiseaseService,
    private hearingService: HearingService,
    private inmateService: InmateService,
    private treatmentService: TreatmentService,
    private bloodSamplingService: BloodSamplingService,
    private vaccinationService: VaccinationService,
    private examinationService: ExaminationService,
    private doctorInmateService: DoctorInmateService,
    private dialogService: DialogService,
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
    this.inmate = this.id ? this.route.snapshot.data['record'] : new Inmate();
    
    this.doctorInmateService.getActiveDoctorInmateByInmateId(this.inmate.id).subscribe((responseData: DoctorInmate) => {
      if (responseData) {
        this.doctorInmate.doctorDescription = responseData.doctorDescription;
      }
      else {
        this.doctorInmate.doctorDescription = null;
      }
    });

    this.clearBloodSamplingArgs();
    this.clearDiseaseArgs();
    this.clearExaminationArgs();
    this.clearVaccinationArgs();
    this.clearTreatmentArgs();
    this.clearHearingArgs();
    this.clearDoctorInmateArgs();
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.medicalFolderForm.dirty;
  }

  goToList() {
    this.router.navigate(['/med/medicalfolder/list']);
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
      inmateId: this.inmate.id,
      diseaseDescription: null,
      fromDiagnosisDate: null,
      toDiagnosisDate: null,
      hearingId: null
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
      disease.inmateId = this.inmate.id;
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
      inmateId: this.inmate.id,
      fromTestDate: null,
      toTestDate: null,
      examinationTypeCategory: null,
      hearingId: null
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
      examination.inmateId = this.inmate.id;
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
      inmateId: this.inmate.id,
      fromSamplingDate: null,
      toSamplingDate: null,
      hearingId: null
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
      bloodSampling.inmateId = this.inmate.id;
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
      inmateId: this.inmate.id,
      vaccineDescription: null,
      fromScheduledDate: null,
      toScheduledDate: null,
      fromVaccinationDate: null,
      toVaccinationDate: null,
      vaccinationStatus: null,
      hearingId: null
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
      vaccination.inmateId = this.inmate.id;
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
      inmateId: this.inmate.id,
      doctorId: null,
      fromDate: null,
      toDate: null,
      treatmentStatusOption: 'ACTIVE',
      medicineTypeOption: null,
      medicineId: null,
      hearingId: null
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
      treatment.inmateId = this.inmate.id;
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
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell1'},
    {field: 'hearingDate', header: this.translate.instant('hearing.hearingDate'), sortField: 'hearingDate', width: '15rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('hearing.doctorId'), sortField: 'doctorId', width: '15rem', align: 'center'},
    {field: 'reviewHearingOption', header: this.translate.instant('hearing.reviewHearing'), sortField: 'reviewHearing', width: '10rem', align: 'center'},
    {field: 'reviewDate', header: this.translate.instant('hearing.reviewDate'), sortField: 'reviewDate', width: '15rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  hearingSortField = 'hearingDate';
  hearingSortOrder = 1;
  hearingArgs = this.initializeHearingArgs();

  @ViewChild('hearingTable') hearingTable;

  initializeHearingArgs() {
    return {
      inmateId: this.inmate.id,
      doctorId: null,
    };
  }

  loadHearingTableData() {
    this.hearingTable.loadTableData();
  }
  
  clearHearingArgs() {
    this.hearingArgs = this.initializeHearingArgs();
  }

  deleteHearing(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.hearingService.deleteHearing(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadHearingTableData();
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
  
  goToHearingViewForCreate() {
    this.router.navigate(['/med/hearing/view/'],
      {queryParams: {inmateId: this.inmate.id}});
  }
  
  goToHearingViewForEdit(id) {
    this.router.navigate(['/med/hearing/view/', id]);
  }
  
  // Γιατροί Κρατουμένου ------------------------------------------------------------------------------------
  
  doctorInmateUrl = doctorInmateConsts.indexUrl;
  doctorInmateCols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center', customCell: 'cell1'},
    {field: 'doctorSpecialty', header: this.translate.instant('doctorInmate.doctorSpecialty'), sortField: 'cm/QGenParameter.genParameter.description', width: '12rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('doctorInmate.doctorId'), sortField: 'doctorFullName', width: '15rem', align: 'center'},
    {field: 'fromDate', header: this.translate.instant('doctorInmate.fromDate'), sortField: 'fromDate', width: '15rem', align: 'center'},
    {field: 'toDate', header: this.translate.instant('doctorInmate.toDate'), sortField: 'toDate', width: '12rem', align: 'center'},
    {field: 'doctorInmateStatus', header: this.translate.instant('doctorInmate.isActive'), sortField: 'isActive', width: '10rem', align: 'center'},
    {field: 'view', width: '4rem', align: 'center' , customCell: 'cell2'},
  ];
  doctorInmateSortField = 'fromDate';
  doctorInmateSortOrder = 1;
  doctorInmateArgs = this.initializeDoctorInmateArgs();

  @ViewChild('doctorInmateTable') doctorInmateTable;

  initializeDoctorInmateArgs() {
    return {
      inmateId: this.inmate.id
    };
  }
  loadDoctorInmateTableData() {
    this.doctorInmateTable.loadTableData();
  }
  clearDoctorInmateArgs() {
    this.doctorInmateArgs = this.initializeDoctorInmateArgs();
  }

  openDoctorInmateViewDialogDialogForCreate() {
    if (!this.id) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('med.save.hearing'));
    }
    else {
      let doctorInmate: DoctorInmate = new DoctorInmate();
      doctorInmate.inmateId = this.inmate.id;
      const doctorInmateViewDialogComponent = this.dialogService.open(DoctorInmateViewDialogComponent, {
        data: {
          doctorInmate: doctorInmate,
        },
        header: this.translate.instant('doctorInmate.dialog.title'),
        width: '65%'
      });

      doctorInmateViewDialogComponent.onClose.subscribe(result => {
        this.doctorInmateService.getActiveDoctorInmateByInmateId(this.inmate.id).subscribe((responseData: DoctorInmate) => {
          if (responseData) {
            this.doctorInmate.doctorDescription = responseData.doctorDescription;
          }
          else {
            this.doctorInmate.doctorDescription = null;
          }
        });
        this.loadDoctorInmateTableData();
      });
    }
  }

  openDoctorInmateViewDialogDialogForEdit(rowData) {
    this.doctorInmateService.getDoctorInmate(rowData.id).subscribe(doctorInmate => {

      const doctorInmateViewDialogComponent = this.dialogService.open(DoctorInmateViewDialogComponent, {
        data: {
          doctorInmate: doctorInmate,
        },
        header: this.translate.instant('doctorInmate.dialog.title'),
        width: '65%'
      });

      doctorInmateViewDialogComponent.onClose.subscribe((result: DoctorInmate) => {
        this.doctorInmateService.getActiveDoctorInmateByInmateId(this.inmate.id).subscribe((responseData: DoctorInmate) => {
          if (responseData) {
            this.doctorInmate.doctorDescription = responseData.doctorDescription;
          }
          else {
            this.doctorInmate.doctorDescription = null;
          }
        });
        this.loadDoctorInmateTableData();
      });
    });
  }

  deleteDoctorInmate(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.doctorInmateService.deleteDoctorInmate(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadDoctorInmateTableData();
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
  
  saveInmateMedDetails(medComments: string) {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    let inmate: Inmate = new Inmate();
    inmate.medComments = medComments;
    inmate.id = this.inmate.id;
    
    this.inmateService.saveInmateMedDetails(inmate).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
