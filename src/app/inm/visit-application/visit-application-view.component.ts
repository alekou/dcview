import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {VisitApplication} from './visit-application.model';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitApplicationService} from './visit-application.service';
import {DateService} from '../../toitsu-shared/date.service';
import {VisitTypeService} from '../../sa/visit-type/visit-type.service';
import {VisitorService} from '../visitor/visitor.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {DialogService} from 'primeng/dynamicdialog';
import {EnumService} from '../../cm/enum/enum.service';
import {VisitApplicationVisitorService} from '../visit-application-visitor/visit-application-visitor.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {VisitApplicationVisitor} from '../visit-application-visitor/visit-application-visitor.model';

@Component({
  selector: 'app-inm-visit-application-view',
  templateUrl: 'visit-application-view.component.html'
})
export class VisitApplicationViewComponent implements OnInit, ExitConfirmation {

  id: number;
  visitApplication: VisitApplication;

  viewLink = '/inm/visitapplication/view';
  indexLink = '/inm/visitapplication/list';

  visitTypes = [];
  visitApplicationStatuses = [];

  relationKinds = [];
  otherRelationKinds = [];

  inmates = [];
  inmateDialogUrl: string;

  @ViewChild(NgForm) visitForm: NgForm;
  

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private dateService: DateService,
    private enumService: EnumService,
    private genParameterService: GenParameterService,
    private visitService: VisitApplicationService,
    private visitTypeService: VisitTypeService,
    private visitApplicationVisitorService: VisitApplicationVisitorService,
    private visitorService: VisitorService,
    private inmateService: InmateService
  ) {
  }

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.visitApplication = this.id ? this.route.snapshot.data['record'] : new VisitApplication();

    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // VisitTypes
    this.visitTypeService.getAllVisitTypes().subscribe({
      next: (responseData) => {
        if (responseData) {
          this.visitTypes = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    });

    // VisitApplicationStatuses
    this.enumService.getEnumValues('inm.core.enums.VisitApplicationStatus').subscribe(responseData => {
      this.visitApplicationStatuses = responseData;
    });
    
    if (!this.visitApplication.id) {
      this.visitApplication.approved = 'PENDING';
    }
    

    // RelationKinds
    this.enumService.getEnumValues('inm.core.enums.InmateRelationKind').subscribe(responseData => {
      this.relationKinds = responseData;
    });

    
    // OtherRelationKinds
    let otherRelationKindPids = [];
    if (this.visitApplication.visitApplicationVisitors) {
      this.visitApplication.visitApplicationVisitors.forEach(visitApplicationVisitor => {
        if (visitApplicationVisitor.statedOtherRelationKindPid) {
          otherRelationKindPids.push(visitApplicationVisitor.statedOtherRelationKindPid);
        }
      });
    }

    this.genParameterService.getByCategory(GenParameterCategory.InmateRelation_OtherRelationKind, true, otherRelationKindPids).subscribe(responseData => {
      this.otherRelationKinds = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.visitForm.dirty;
  }

  lockedRecord() {
    if (this.visitApplication.dcId) {
      return (this.visitApplication.dcId !== this.authService.getUserDcId());
    }
  }
  newRecord() {
    this.router.navigate([this.viewLink]);
  }

  goToList() {
    this.router.navigate([this.indexLink]);
  }

  saveVisitApplication() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    // console.log(this.visitApplication);
    // return;

    this.visitService.saveVisitApplication(this.visitApplication).subscribe({
      next: (responseData: VisitApplication) => {
        this.toitsuToasterService.showSuccessStay();
        this.visitForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/visitapplication/view', responseData.id]);
        } else {
          this.visitApplication = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVisit() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.visitService.deleteVisitApplication(this.visitApplication.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.visitForm.form.markAsPristine();
            this.router.navigate(['/inm/visitapplication/list']);
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

  addVisitApplicationVisitor() {
    let visitApplicationVisitor = new VisitApplicationVisitor();
    
    this.visitApplication.visitApplicationVisitors.push(visitApplicationVisitor);
  }
  deleteVisitApplicationVisitor(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitApplication.visitApplicationVisitors.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.visitApplicationVisitorService.deleteVisitApplicationVisitor(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitApplication.visitApplicationVisitors.splice(index, 1);
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
  clearVisitDates() {
    this.visitApplication.visitDate = null;
    this.visitApplication.visitDateFrom = null;
    this.visitApplication.visitDateTo = null;
  }

  getVisitTypeKindByVisitTypeId(visitTypeId: number) {
    if (this.visitTypes.filter(visitType => visitType.id === visitTypeId).length !== 0) {
      return (this.visitTypes.filter(visitType => visitType.id === visitTypeId)[0]['kind']);
    }
  }
}
