import {Component, OnInit, ViewChild} from '@angular/core';
import {InmateAreaService} from '../inmate-area.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {DateService} from '../../../toitsu-shared/date.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {InmateArea} from '../inmate-area.model';
import {NgForm} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-inm-inmate-area-set-inactive-dialog',
  templateUrl: 'inmate-area-set-inactive-dialog.component.html',
  styleUrls: ['../inmate-area.css']
})

export class InmateAreaSetInactiveDialogComponent implements OnInit {

  inmateAreaToSetInactive: InmateArea = new InmateArea();
  @ViewChild(NgForm) setInactiveInmateAreaForm: NgForm;

  constructor(
    private inmateAreaService: InmateAreaService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private dateService: DateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {
  }

  ngOnInit(): void {
    // Αρχικοποίηση δεδομένων
    this.inmateAreaToSetInactive = this.dynamicDialogConfig.data.inmateAreaToSetInactive;
  }

  setInactiveInmateArea() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.inmateAreaService.saveInmateArea(this.inmateAreaToSetInactive).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay();
        this.setInactiveInmateAreaForm.form.markAsPristine();
        this.dynamicDialogRef.close(responseData);
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });

  }

  cancel() {
    this.dynamicDialogRef.close();
  }

}
