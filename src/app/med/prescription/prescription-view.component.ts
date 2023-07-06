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
import {MedicineService} from '../medicine/medicine.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Prescription} from './prescription.model';
import {PrescriptionService} from './prescription.service';
import {PrescriptionLineService} from '../prescription-line/prescription-line.service';
import {PrescriptionLine} from '../prescription-line/prescription-line.model';
import {TreatmentLineListDialogComponent} from '../treatment-line/treatment-line-list-dialog.component.';
import {Medicine} from '../medicine/medicine.model';

@Component({
  selector: 'app-med-prescription-view',
  templateUrl: 'prescription-view.component.html'
})
export class PrescriptionViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) prescriptionForm: NgForm;
  id: number;
  medicineType = 'ALL';
  medicineTYpeChecked: boolean = false;
  prescription: Prescription = new Prescription();
  inmateDialogUrl: string;
  activeDoctors = [];
  medicines = [];

  constructor(
    private medicineService: MedicineService,
    private prescriptionService: PrescriptionService,
    private prescriptionLineService: PrescriptionLineService,
    public authService: AuthService,
    private doctorService: DoctorService,
    private dialogService: DialogService,
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
    this.prescription = this.id ? this.route.snapshot.data['record'] : new Prescription();

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    this.doctorService.getAllActiveDoctors().subscribe(activeDoctors => {
      this.activeDoctors = activeDoctors;
    });
    
    if (this.id) {
      // Medicines
      this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(medicines => {
        this.medicines = medicines;
      });
    }

    if (!this.id) {
      this.medicineType = 'GENERAL';
      // Medicines
      this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(medicines => {
        this.medicines = medicines;
      });
    }

    if (!this.id) {

      this.prescriptionService.getSerialNumber().subscribe((responseData: number) => {

        this.prescription.serialNo = responseData;
      });
      
      this.prescription.prescriptionDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.prescriptionForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/prescription/view']);
  }

  goToList() {
    this.router.navigate(['/med/prescription/list']);
  }

  savePrescription() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.prescriptionService.savePrescription(this.prescription).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.prescriptionForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/prescription/view/', responseData.id]);
        } else {
          this.prescription = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deletePrescription() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.prescriptionService.deletePrescription(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.prescriptionForm.form.markAsPristine();
            this.router.navigate(['/med/prescription/list']);
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

  medicineTypeChanged() {
    if (this.prescription.isPsychiatric) {
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
    if (this.prescription.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }

  // Επιλογή Γραμμών Συνταγών----------------------------------------------------------------------------------

  addPrescriptionLine() {
    this.medicineTYpeChecked = true;
    let prescriptionLine: PrescriptionLine =  new PrescriptionLine();
    
    this.prescription.prescriptionLines.push(prescriptionLine);
  }
  
  deletePrescriptionLine(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.prescription.prescriptionLines.splice(index, 1);
          if (this.prescription.prescriptionLines.length === 0) {
            this.medicineTYpeChecked = false;
          }
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.prescriptionLineService.deletePrescriptionLine(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.prescription.prescriptionLines.splice(index, 1);
              if (this.prescription.prescriptionLines.length === 0) {
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
  
  openTreatmentLineListDialog() {
    const treatmentLineListDialog = this.dialogService.open(TreatmentLineListDialogComponent, {
      data: {
        inmateId: this.prescription.inmateId,
        isPsychiatric: this.prescription.isPsychiatric
      },
      header: this.translate.instant('treatmentLineList.dialogTitle'),
      width: '90%'
    });
    
    this.medicineTYpeChecked = true;
    
    treatmentLineListDialog.onClose.subscribe(result => {
      let prescriptionLineListFromDialog = [];
      prescriptionLineListFromDialog = result;
      if (prescriptionLineListFromDialog) {
        prescriptionLineListFromDialog.filter(prescriptionLineFromDialog => {

          const foundPrescriptionLine = this.prescription.prescriptionLines.find((storedPrescriptionLine: PrescriptionLine) => {
            return storedPrescriptionLine.medicineId === prescriptionLineFromDialog.medicineId;
          });
          if (foundPrescriptionLine) {
            foundPrescriptionLine.packetQuantity += prescriptionLineFromDialog.packetQuantity;
            foundPrescriptionLine.unitQuantity += prescriptionLineFromDialog.unitQuantity;
          }
          else {
            this.prescription.prescriptionLines.push(prescriptionLineFromDialog);
          }
        });
      }
      if (this.prescription.prescriptionLines.length === 0) {
       this.medicineTYpeChecked = false; 
      }
    });
  }

  medicineChanged(prescriptionLine: PrescriptionLine) {
    if (prescriptionLine.medicineId === null) {
      prescriptionLine.unitQuantity = null;
      prescriptionLine.packetQuantity = null;
    }
  }

  packageNumberChanged(prescriptionLine: PrescriptionLine) {
    if (prescriptionLine.medicineId === null) {
      prescriptionLine.unitQuantity = null;
      prescriptionLine.packetQuantity = null;
    }
    else {
      this.medicineService.getMedicine(prescriptionLine.medicineId).subscribe((responseData: Medicine) => {
        return prescriptionLine.unitQuantity = responseData.quantityPerPacket * prescriptionLine.packetQuantity;
      });
    }
  }

  unitQuantityChanged(prescriptionLine: PrescriptionLine) {
    if (prescriptionLine.medicineId === null) {
      prescriptionLine.unitQuantity = null;
      prescriptionLine.packetQuantity = null;
    }
    else {
      this.medicineService.getMedicine(prescriptionLine.medicineId).subscribe((responseData: Medicine) => {
        return prescriptionLine.packetQuantity = Math.ceil((prescriptionLine.unitQuantity / responseData.quantityPerPacket));
      });
    }
  }
}
