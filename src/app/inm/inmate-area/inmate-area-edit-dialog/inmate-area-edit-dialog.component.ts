import {Component, OnInit, ViewChild} from '@angular/core';
import {InmateArea} from '../inmate-area.model';
import {DateService} from '../../../toitsu-shared/date.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {HttpErrorResponse} from '@angular/common/http';
import {InmateAreaService} from '../inmate-area.service';
import {Router} from '@angular/router';
import {ToitsuNavService} from '../../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-inm-inmate-area-edit-dialog',
  templateUrl: 'inmate-area-edit-dialog.component.html',
  styleUrls: ['../inmate-area.css']
})

export class InmateAreaEditDialogComponent implements OnInit {

  inmateAreaToEdit: InmateArea = new InmateArea();
  @ViewChild(NgForm) editInmateAreaForm: NgForm;

  alreadyReserved: boolean = false;
  alreadyReservedDate: Date = null;

  constructor(
    private inmateAreaService: InmateAreaService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private dateService: DateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    private translate: TranslateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    // Αρχικοποίηση δεδομένων
    this.inmateAreaToEdit = this.dynamicDialogConfig.data.inmateAreaToEdit;

    // Έλεγχος αν η Θέση είναι ήδη κρατημένη
    if (this.inmateAreaToEdit.reserved) {
      this.alreadyReserved = true;
      this.alreadyReservedDate = this.inmateAreaToEdit.reservationDate;
    }

  }

  editPlacement() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.inmateAreaService.saveInmateArea(this.inmateAreaToEdit).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateArea.edit.success'));
        this.editInmateAreaForm.form.markAsPristine();
        this.dynamicDialogRef.close(responseData);
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      // Ανανέωση σελίδας
      this.router.navigate(['/']).then(() => {
        this.router.navigate(['/inm/inmatearea/manage']);
      });
      this.toitsuNavService.onMenuStateChange('0');
    });
  }

  cancel() {
    if (this.editInmateAreaForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.resetSpecificFormFields();
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

  resetSpecificFormFields() {
    this.editInmateAreaForm.controls['reason'].reset();
    this.editInmateAreaForm.controls['comments'].reset();
    this.editInmateAreaForm.controls['inactive'].setValue(true);
    this.editInmateAreaForm.controls['exitDate'].setValue(null);
  }

  getActiveStatus() {
    return true;
  }

  getInactiveStatus() {
    return false;
  }

  enableInactiveDate() {
    if (!this.inmateAreaToEdit.active) {
      this.inmateAreaToEdit.exitDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateAreaToEdit.exitDate = null;
    }
  }

  enableReservedDate() {
    if (this.inmateAreaToEdit.reserved) {
      this.inmateAreaToEdit.reservationDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateAreaToEdit.reservationDate = null;
    }
  }

  closeWarningMessage() {
    this.dynamicDialogRef.close();
  }

}
