import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ExitConfirmation} from '../../../toitsu-shared/exit-confirmation.guard';
import {Treatment} from '../treatment.model';
import {Shift} from '../../shift/shift.model';
import {TreatmentService} from '../treatment.service';
import {ShiftService} from '../../shift/shift.service';
import {DoctorService} from '../../../sa/doctor/doctor.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DateService} from '../../../toitsu-shared/date.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {inmateConsts} from '../../../inm/inmate/inmate.consts';
import {Observable} from 'rxjs';
import {TreatmentLine} from '../../treatment-line/treatment-line.model';
import {MedicineService} from '../../medicine/medicine.service';
import {HearingService} from '../../hearing/hearing.service';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {TreatmentLineService} from '../../treatment-line/treatment-line.service';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-treatment-view-dialog',
  templateUrl: 'treatment-view-dialog.component.html'
})
export class TreatmentViewDialogComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) treatmentForm: NgForm;
  medicineType = 'ALL';
  medicineTYpeChecked: boolean = false;
  treatment: Treatment = new Treatment();
  shift: Shift = new Shift();
  medicines = [];
  inmateDialogUrl: string;
  activeDoctors = [];
  hearings = [];
  constructor(
    private medicineService: MedicineService,
    private hearingService: HearingService,
    private treatmentService: TreatmentService,
    private treatmentLineService: TreatmentLineService,
    public authService: AuthService,
    private shiftService: ShiftService,
    private doctorService: DoctorService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dateService: DateService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {
    this.treatment = this.dynamicDialogConfig.data['treatment'];
  }

  ngOnInit() {

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    this.doctorService.getAllActiveDoctors().subscribe(responseData => {
      this.activeDoctors = responseData;
    });
    
    if (this.treatment.id) {
      // Medicines
      this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(medicines => {
        this.medicines = medicines;

        if (this.treatment.id) {
          this.treatment.treatmentLines.forEach(treatmentLine => {
            const foundCurrentMedicine = this.medicines.find((result) => {
              return result.id === treatmentLine.medicineId;
            });
            if (foundCurrentMedicine) {
              treatmentLine.medicineMeasurementUnit = foundCurrentMedicine.measurementUnit;
            }
            else {
              treatmentLine.medicineMeasurementUnit = null;
            }
          });
        }
      });
    }
    
    if (this.treatment.inmateId) {
     this.getHearingsByInmateId(this.treatment.inmateId);
    }
    
    if (this.treatment.id) {
      // Ανάκτηση id της βάρδιας που γράφτηκε η αγωγή
      this.treatment.treatmentLines.filter(treatmentLine => {
        this.shift.id = treatmentLine.shiftId;
      });
      if (this.shift.id !== null) {
        // ανάκτηση της της βάρδιας για την αγωγή
        this.shiftService.getShift(this.shift.id).subscribe((responseData: Shift) => {
          this.shift = responseData;
        });
      }
      else {
        this.shiftService .getActiveShift().subscribe((responseData: Shift) => {
          this.shift = responseData;
        });
      }
    }
    if (!this.treatment.id) {
      this.medicineType = 'GENERAL';
      // Medicines
      this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(medicines => {
        this.medicines = medicines;
      });
    }
    
    if (!this.treatment.id) {
      this.treatmentService.getSerialNumber().subscribe((responseData: number) => {
        this.treatment.serialNo = responseData;
      });

      this.shiftService .getActiveShift().subscribe((responseData: Shift) => {
        this.shift = responseData;
      });
      this.treatment.treatmentDate = this.dateService.getCurrentDateTimeString() as unknown as Date;

    }
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.treatmentForm.dirty;
  }

  saveTreatment() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    // Πριν την αποθήκευση αφαίρεση του medicineMeasurementUnit property που δεν υπάρχει στο backend
    this.treatment.treatmentLines.forEach(treatmentLine => {
      delete treatmentLine.medicineMeasurementUnit;
    });
    
    this.treatmentService.saveTreatment(this.treatment).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close(this.treatment);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteTreatment() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.treatmentService.deleteTreatment(this.treatment.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.dynamicDialogRef.close();
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

  inmateIdChanged() {
    this.hearings = [];
    this.getHearingsByInmateId(this.treatment.inmateId);
  }
  
  medicineTypeChanged() {
    if (this.treatment.isMedPsychiatric) {
      this.medicineType = 'PSYCHIATRIC';
    }
    else {
      this.medicineType = 'GENERAL';
    }
    this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(responseData => {
      this.medicines = responseData;
    });
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.treatment.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.treatment.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
  
  getHearingsByInmateId(inmateId){
    if (inmateId) {
      this.hearingService.getAllHearingsByInmateId(inmateId).subscribe(retrievedHearings => {
        if (retrievedHearings) {
          this.hearings = retrievedHearings;
        }
      });
    }
    else {
      this.hearings = [];
    }
  }
  
  // Επιλογή Γραμμών Αγωγών----------------------------------------------------------------------------------

  addTreatmentLine() {
    this.medicineTYpeChecked = true;
    let treatmentLine: TreatmentLine =  new TreatmentLine();
    treatmentLine.shiftId = this.shift.id;
    treatmentLine.stepDays = 1;
    treatmentLine.totalDays = 0;
    this.treatment.treatmentLines.push(treatmentLine);
  }

  deleteTreatmentLine(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.treatment.treatmentLines.splice(index, 1);
          if (this.treatment.treatmentLines.length === 0) {
            this.medicineTYpeChecked = false;
          }
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.treatmentLineService.deleteTreatmentLine(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.treatment.treatmentLines.splice(index, 1);
              if (this.treatment.treatmentLines.length === 0) {
                this.medicineTYpeChecked = false;
              }
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

  stopTreatment() {
    this.confirmationService.confirm({
      message: this.translate.instant('med.stop.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.treatment.stop = true;
        this.treatmentService.stopTreatment(this.treatment).subscribe({
          next: (responseData: any) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('med.stop.success'));
            this.dynamicDialogRef.close();
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

  forLifeChecked(treatmentLine: TreatmentLine) {
    treatmentLine.toDate = null;
    treatmentLine.totalDays = null;
  }

  fromDateChanged(treatmentLine: TreatmentLine) {
    treatmentLine.toDate = this.dateService.addDays(treatmentLine.fromDate, treatmentLine.totalDays);
  }

  medicineIdChanged(treatmentLine: TreatmentLine) {
    const foundCurrentMedicine = this.medicines.find((result) => {
      return result.id === treatmentLine.medicineId;
    });
    if (foundCurrentMedicine) {
      treatmentLine.medicineMeasurementUnit = foundCurrentMedicine.measurementUnit;
    }
    else {
      treatmentLine.medicineMeasurementUnit = null;
    }
  }

  cancel() {
    if (this.treatmentForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {

        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }
}
