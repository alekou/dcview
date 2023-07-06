import {Component, OnInit, ViewChild} from '@angular/core';
import {InmateArea} from '../inmate-area.model';
import {HttpErrorResponse} from '@angular/common/http';
import {InmateAreaService} from '../inmate-area.service';
import {AreaService} from '../../area/area.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DateService} from '../../../toitsu-shared/date.service';
import {Router} from '@angular/router';
import {DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';
import {NgForm} from '@angular/forms';
import {ToitsuNavService} from '../../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-inm-inmate-area-move-dialog',
  templateUrl: 'inmate-area-move-dialog.component.html',
  styleUrls: ['../inmate-area.css']
})

export class InmateAreaMoveDialogComponent implements OnInit {

  selectedInmateAreaRecord = null;
  newInmateArea: InmateArea = new InmateArea();
  lastInmateArea: InmateArea = new InmateArea();

  @ViewChild(NgForm) moveInmateForm: NgForm;
  areas = [];

  alreadyReserved: boolean = false;
  alreadyReservedDate: Date = null;

  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private inmateAreaService: InmateAreaService,
    private areaService: AreaService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    private dateService: DateService,
    private translate: TranslateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Αρχικοποίηση δεδομένων
    this.selectedInmateAreaRecord = this.dynamicDialogConfig.data.selectedInmateAreaRecord;
    this.lastInmateArea = this.dynamicDialogConfig.data.lastInmateArea;
    this.newInmateArea = this.dynamicDialogConfig.data.newInmateArea;

    // Έλεγχος αν η Θέση είναι ήδη κρατημένη
    if (this.lastInmateArea.reserved) {
      this.alreadyReserved = true;
      this.alreadyReservedDate = this.lastInmateArea.reservationDate;
    }

    // Φόρτωση λίστας περιοχών που μπορούν να φιλοξενήσουν κρατούμενους
    this.areaService.getAllChildAreas().subscribe(responseData => {
      this.areas = responseData;
    });
  }

  moveInmate() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.inmateAreaService.moveInmate(this.lastInmateArea, this.newInmateArea).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateArea.move.success'));
        this.moveInmateForm.form.markAsPristine();
        this.dynamicDialogRef.close(responseData);
        // Ανανέωση σελίδας
        this.router.navigate(['/']).then(() => {
          this.router.navigate(['/inm/inmatearea/manage']);
        });
        this.toitsuNavService.onMenuStateChange('0');
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  cancel() {
    if (this.moveInmateForm.dirty) {
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
    this.moveInmateForm.controls['newInmateArea'].reset();
    this.moveInmateForm.controls['entryDate'].setValue(this.getCurrentDate());
    this.moveInmateForm.controls['reason'].reset();
    this.moveInmateForm.controls['comments'].reset();
  }

  getCurrentDate() {
    return this.dateService.getCurrentDateString() as unknown as Date;
  }

  enableReservedDate() {
    if (this.lastInmateArea.reserved) {
      this.lastInmateArea.reservationDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.lastInmateArea.reservationDate = null;
    }
  }

  areaChanged() {
    // Έλεγχος αν η επιλεγμένη περιοχή κράτησης έχει Διαθέσιμες Θέσεις
    let selectedArea;
    if (this.newInmateArea.areaId) {
      selectedArea = this.areas.find(i => i.id === this.newInmateArea.areaId);
      if (selectedArea.availablePositions > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

}
