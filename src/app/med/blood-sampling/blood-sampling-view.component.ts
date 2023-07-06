import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {BloodSampling} from './blood-sampling.model';
import {BloodSamplingService} from './blood-sampling.service';
import {DialogService} from 'primeng/dynamicdialog';
import {ExaminationTypeListDialogComponent} from '../examination-type/examination-type-list-dialog/examination-type-list-dialog.component';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {Examination} from '../examination/examination.model';
import {ExaminationType} from '../examination-type/examination-type.model';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ExaminationService} from '../examination/examination.service';

@Component({
  selector: 'app-med-blood-sampling-view',
  templateUrl: 'blood-sampling-view.component.html'
})
export class BloodSamplingViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) bloodSamplingForm: NgForm;
  id: number;
  bloodSampling: BloodSampling = new BloodSampling();
  inmateDialogUrl: string;

  constructor(
    private examinationService: ExaminationService,
    private bloodSamplingService: BloodSamplingService,
    public authService: AuthService,
    private dialogService: DialogService,
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
    this.bloodSampling = this.id ? this.route.snapshot.data['record'] : new BloodSampling();

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.bloodSamplingForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/bloodsampling/view']);
  }

  goToList() {
    this.router.navigate(['/med/bloodsampling/list']);
  }

  saveBloodSampling() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.bloodSamplingService.saveBloodSampling(this.bloodSampling).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.bloodSamplingForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/bloodsampling/view/', responseData.id]);
        } else {
          this.bloodSampling = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteBloodSampling() {

    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.bloodSamplingService.deleteBloodSampling(this.bloodSampling.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.bloodSamplingForm.form.markAsPristine();
            this.router.navigate(['/med/bloodsampling/list']);
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

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.bloodSampling.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
  // Επιλογή Εξετάσεων----------------------------------------------------------------------------------
  selectedExaminationTypes = [];
  examinationType = new ExaminationType();

  openDialog() {
    const examinationTypeListDialog = this.dialogService.open(ExaminationTypeListDialogComponent, {
      data: {
        hearingId: null,
        inmateId: null
      },
      header: this.translate.instant('bloodSamplingExamination.dialogTitle'),
      width: '90%'
    });

    examinationTypeListDialog.onClose.subscribe(result => {
      this.selectedExaminationTypes = [];
      if (result) {
        result.filter(examinationType => {
          this.selectedExaminationTypes.push(examinationType);
        });
      }

      this.selectedExaminationTypes.forEach(examinationType => {
        let examination = new Examination();
        examination.examinationTypeId = examinationType.id;
        examination.examinationType.description = examinationType.description;
        this.bloodSampling.examinations.push(examination);
      });
    });
  }
  
  deleteExamination(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.bloodSampling.examinations.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          this.examinationService.deleteExamination(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.bloodSampling.examinations.splice(index, 1);
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
}
