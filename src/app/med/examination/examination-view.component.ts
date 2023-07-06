import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Examination} from './examination.model';
import {ExaminationService} from './examination.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {DateService} from '../../toitsu-shared/date.service';
import {ExaminationTypeService} from '../examination-type/examination-type.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-med-examination-view',
  templateUrl: 'examination-view.component.html'
})
export class ExaminationViewComponent implements OnInit, ExitConfirmation {
  
  @ViewChild(NgForm) examinationForm: NgForm;
  id: number;
  examination: Examination = new Examination();
  examinationTypeCategories = [];
  inmateDialogUrl: string;
  constructor(
    private dateService: DateService,
    private examinationService: ExaminationService,
    private examinationTypeService: ExaminationTypeService,
    public authService: AuthService,
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
    this.examination = this.id ? this.route.snapshot.data['record'] : new Examination();
    
    if (!this.id) {
      this.examination.examinationDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }

    this.examinationTypeService.getAllExaminationTypes().subscribe(responseData => {
      this.examinationTypeCategories = responseData;
    });

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.examinationForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/examination/view']);
  }

  goToList() {
    this.router.navigate(['/med/examination/list']);
  }

  saveExamination() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.examinationService.saveExamination(this.examination).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.examinationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/examination/view/', responseData.id]);
        } else {
          this.examination = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteExamination() {

    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.examinationService.deleteExamination(this.examination.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.examinationForm.form.markAsPristine();
            this.router.navigate(['/med/examination/list']);
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
    if (this.examination.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
}
