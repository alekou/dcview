import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {ProgramType} from './program-type.model';
import {ProgramTypeService} from './program-type.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {GenParameterType} from '../gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';
import {AuthService} from '../../toitsu-auth/auth.service';
@Component({
  selector: 'app-inm-program-type-view',
  templateUrl: 'program-type-view.component.html'
})
export class ProgramTypeViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) programTypeForm: NgForm;
  id: number;
  programType: ProgramType = new ProgramType();
  kinds = [];

  pDisplayedCategories = {};

  pSchoolCategories = {};
  pCourseCategories = {};

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService,
    private programTypeService: ProgramTypeService,
    public authService: AuthService) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.programType = this.id ? this.activatedRoute.snapshot.data['record'] : new ProgramType();

    // Kind
    this.enumService.getEnumValues('inm.core.enums.ProgramTypeKind').subscribe(responseData => {
      this.kinds = responseData;
    });

    this.genParameterTypeService.getByCategory(GenParameterCategory.ProgramType_SchoolCategory, [this.programType.categoryPid]).subscribe((schoolResponseData: GenParameterType) => {
      this.genParameterTypeService.getByCategory(GenParameterCategory.ProgramType_CourseCategory, [this.programType.categoryPid]).subscribe((courseResponseData: GenParameterType) => {
        this.pSchoolCategories = schoolResponseData;
        this.pCourseCategories = courseResponseData;
        this.initializeDisplayedCategories();
      });
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.programTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/programtype/view']);
  }

  goToList() {
    this.router.navigate(['/sa/programtype/list']);
  }

  saveProgramType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.programTypeService.saveProgramType(this.programType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.programTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/programtype/view/', responseData.id]);
        } else {
          this.programType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteProgramType() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.programTypeService.deleteProgramType(this.programType.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.programTypeForm.form.markAsPristine();
            this.router.navigate(['/sa/programtype/list']);
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

  kindChanged() {
    this.programType.categoryPid = null;
    this.initializeDisplayedCategories();
  }

  initializeDisplayedCategories() {
    if (!this.programType.kind) {
      this.pDisplayedCategories = [];
    } else {
      if (this.programType.kind === 'SCHOOL') {
        this.pDisplayedCategories = this.pSchoolCategories;
      } else if (this.programType.kind === 'COURSE') {
        this.pDisplayedCategories = this.pCourseCategories;
      } else {
        this.pDisplayedCategories = [];
      }
    }
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.programType.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
}
