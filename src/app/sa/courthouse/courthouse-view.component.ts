import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DateService} from '../../toitsu-shared/date.service';
import {Courthouse} from './courthouse.model';
import {CourthouseService} from './courthouse.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {CityService} from '../city/city.service';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../gen-parameter-type/gen-parameter-type.model';

@Component({
  selector: 'app-sa-courthouse-view',
  templateUrl: 'courthouse-view.component.html'
})
export class CourthouseViewComponent implements OnInit, ExitConfirmation {
  id: number;
  courthouse: Courthouse;
  pCategory = {};
  pSpecialType = {};
  pKind = {};
  pType = {};
  pSpecialCase = {};
  cities = [];
  
  @ViewChild(NgForm) courthouseForm: NgForm;
  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private courthouseService: CourthouseService,
    private enumService: EnumService,
    private dateService: DateService,
    private genParameterTypeService: GenParameterTypeService,
    private cityService: CityService) {}
  ngOnInit(): void {
    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.courthouse = this.id ? this.activatedRoute.snapshot.data['record'] : new Courthouse();
    
    // Categories
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_Category, [this.courthouse.categoryPid]).subscribe((responseData: GenParameterType) => {
      this.pCategory = responseData;
    });

    // Special Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_SpecialType, [this.courthouse.specialTypePid]).subscribe((responseData: GenParameterType) => {
      this.pSpecialType = responseData;
    });

    // Kinds
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_Kind, [this.courthouse.kindPid]).subscribe((responseData: GenParameterType) => {
      this.pKind = responseData;
    });
    
    // Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_Type, [this.courthouse.typePid]).subscribe((responseData: GenParameterType) => {
      this.pType = responseData;
    });
    
    // Special Cases
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_SpecialCase, [this.courthouse.specialCasePid]).subscribe((responseData: GenParameterType) => {
      this.pSpecialCase = responseData;
    });
    
    // Cities
    this.cityService.getGreekCities(true, [this.courthouse.cityId]).subscribe({
      next: (responseData) => {this.cities = responseData;
      }
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.courthouseForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/courthouse/view']);
  }

  goToList() {
    this.router.navigate(['/sa/courthouse/list']);
  }

  saveCourthouse() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.courthouseService.saveCourthouse(this.courthouse).subscribe({
      next: (responseData: Courthouse) => {
        this.toitsuToasterService.showSuccessStay();
        this.courthouseForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/courthouse/view', responseData.id]);
        }
        else {
          this.courthouse = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  deleteCourthouse() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.courthouseService.deleteCourthouse(this.courthouse.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.courthouseForm.form.markAsPristine();
            this.router.navigate(['/sa/courthouse/list']);
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
