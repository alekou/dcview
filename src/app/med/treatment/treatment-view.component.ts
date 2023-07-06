import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {Treatment} from './treatment.model';
import {TreatmentService} from './treatment.service';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {TreatmentLine} from '../treatment-line/treatment-line.model';
import {ShiftService} from '../shift/shift.service';
import {Shift} from '../shift/shift.model';
import {DateService} from '../../toitsu-shared/date.service';
import {MedicineService} from '../medicine/medicine.service';
import {HearingService} from '../hearing/hearing.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {TreatmentLineService} from '../treatment-line/treatment-line.service';

@Component({
  selector: 'app-med-treatment-view',
  templateUrl: 'treatment-view.component.html'
})
export class TreatmentViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) treatmentForm: NgForm;
  id: number;
  medicineType = 'ALL';
  medicineTYpeChecked: boolean = false;
  treatment: Treatment = new Treatment();
  shift: Shift = new Shift();
  inmateDialogUrl: string;
  activeDoctors = [];
  medicines = [];
  hearings = [];

  constructor(
    private hearingService: HearingService,
    private medicineService: MedicineService,
    public authService: AuthService,
    private treatmentService: TreatmentService,
    private treatmentLineService: TreatmentLineService,
    private shiftService: ShiftService,
    private doctorService: DoctorService,
    private dateService: DateService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.treatment = this.id ? this.route.snapshot.data['record'] : new Treatment();
    
    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    this.doctorService.getAllActiveDoctors().subscribe(activeDoctors => {
      this.activeDoctors = activeDoctors;
    });

    if (this.treatment.id) {
     this.getHearingsByInmateId(this.treatment.inmateId);
   }
    
    if (this.id) {
      // Medicines
      this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(medicines => {
        this.medicines = medicines;

        if (this.id) {
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
    
    
    if (this.id) {
      // Ανάκτηση id της βάρδιας που γράφτηκε η αγωγή
      this.treatment.treatmentLines.filter(treatmentLine => {
        this.shift.id = treatmentLine.shiftId;
        
      });
      if (this.shift.id !== null) {
       // ανάκτηση της βάρδιας για την αγωγή
       this.shiftService.getShift(this.shift.id).subscribe((responseData: Shift) => {
         // this.retrievedShift = shift;
         this.shift = responseData;
       });
     }
      else {
        this.shiftService.getActiveShift().subscribe((responseData: Shift) => {
          this.shift = responseData;
        });
      }
    }
    if (!this.id) {
      this.medicineType = 'GENERAL';
      // Medicines
      this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(medicines => {
        this.medicines = medicines;
      });
    }
    
    if (!this.id) {
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

  newRecord() {
    this.router.navigate(['/med/treatment/view']);
  }

  goToList() {
    this.router.navigate(['/med/treatment/list']);
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
        this.treatmentForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/treatment/view/', responseData.id]);
        } else {
          this.treatment = responseData;
        }
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
        this.treatmentService.deleteTreatment(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.treatmentForm.form.markAsPristine();
            this.router.navigate(['/med/treatment/list']);
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
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.treatment.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
  
  getHearingsByInmateId(inmateId) {
    if (inmateId) {
      this.hearingService.getAllHearingsByInmateId(inmateId).subscribe(retrievedHearings => {
        this.hearings = retrievedHearings;
      });
    }
    else {
      this.hearings = [];
    }
  }
  
  
  // Επιλογή Γραμμών Αγωγών----------------------------------------------------------------------------------
  
  addTreatmentLine() {
    this.medicineTYpeChecked = true;
    this.shiftService.getActiveShift().subscribe((responseData: Shift) => {
      this.shift = responseData;
    });
    let treatmentLine: TreatmentLine =  new TreatmentLine();
    treatmentLine.shiftId = this.shift.id;
    treatmentLine.stepDays = 1;
    treatmentLine.totalDays = 1;
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

    // Πριν την αποθήκευση αφαίρεση του medicineMeasurementUnit property που δεν υπάρχει στο backend
    this.treatment.treatmentLines.forEach(treatmentLine => {
      delete treatmentLine.medicineMeasurementUnit;
    });
    
    this.confirmationService.confirm({
      message: this.translate.instant('med.stop.confirmation'),
      
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.treatment.stop = true;
        this.treatmentService.stopTreatment(this.treatment).subscribe({
          next: (responseData: any) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('med.stop.success'));
            this.treatmentForm.form.markAsPristine();
            this.router.navigate(['/med/treatment/view', responseData.id]);
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
    treatmentLine.toDate = this.dateService.addDays(treatmentLine.fromDate, treatmentLine.totalDays - 1);
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
}
