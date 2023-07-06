import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Shift} from './shift.model';
import {ShiftService} from './shift.service';

@Component({
  selector: 'app-med-shift-view',
  templateUrl: 'shift-view.component.html'
})
export class ShiftViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) shiftForm: NgForm;
  id: number;
  shift: Shift = new Shift();

  constructor(
    private shiftService: ShiftService,
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
    this.shift = this.id ? this.route.snapshot.data['record'] : new Shift();

  }
  confirmExit(): boolean | Observable<boolean> {
    return this.shiftForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/shift/view']);
  }

  goToList() {
    this.router.navigate(['/med/shift/list']);
  }

  saveShift() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.shiftService.saveShift(this.shift).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.shiftForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/shift/view/', responseData.id]);
        } else {
          this.shift = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteShift() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.shiftService.deleteShift(this.shift.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.shiftForm.form.markAsPristine();
            this.router.navigate(['/med/shift/list']);
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
}
