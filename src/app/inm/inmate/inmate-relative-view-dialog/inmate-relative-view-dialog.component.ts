import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {GenParameterService} from '../../../sa/gen-parameter/gen-parameter.service';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {InmateRelationService} from '../../inmate-relation/inmate-relation.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {inmateConsts} from '../inmate.consts';
import {Observable} from 'rxjs';
import {InmateRelation} from '../../inmate-relation/inmate-relation.model';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {CityService} from '../../../sa/city/city.service';
import {CountryService} from '../../../sa/country/country.service';
import {InmateService} from '../inmate.service';
import {GenParameterType} from '../../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';
import {VisitorService} from '../../visitor/visitor.service';
import {Visitor} from '../../visitor/visitor.model';

@Component({
  selector: 'app-inm-inmate-relative-view-dialog',
  templateUrl: 'inmate-relative-view-dialog.component.html',
  styleUrls: ['./inmate-relative-view-dialog.component.css']
})
export class InmateRelativeViewDialogComponent implements OnInit {

  id: number;

  @ViewChild(NgForm) visitorForm: NgForm;
  inmateId: number;
  inmateDialogUrl: string;
  inmates = [];
  relationKind: string;
  relationKinds = [];
  visitor: Visitor;
  visitorId: number;
  visitorCategories = [];
  pVisitorCategories = {};
  pLawyerClubs = {};
  lawyerClubs = [];
  allCountries = [];
  cities = [];
  pOtherRelationKind = {};


  constructor(
    private inmateService: InmateService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private visitorService: VisitorService,
    private genParameterService: GenParameterService,
    private confirmationService: ConfirmationService,
    private inmateRelationService: InmateRelationService,
    private cityService: CityService,
    private countryService: CountryService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService
  ) {
    this.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.visitor = this.dynamicDialogConfig.data['visitor'];
    this.relationKind = this.dynamicDialogConfig.data['relationKind'];
  }

  ngOnInit() {
    if (this.visitor === null) {
      this.visitor = new Visitor();
    }
    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // VisitorCategories
    this.genParameterService.getByCategory(GenParameterCategory.Visitor_Category, true, [this.visitor.visitorCategoryPid]).subscribe(responseData => {
      this.visitorCategories = responseData;
    });
    // VisitorCategories
    this.genParameterTypeService.getByCategory(GenParameterCategory.Visitor_Category, [this.visitor.visitorCategoryPid]).subscribe((responseData: GenParameterType) => {
      this.pVisitorCategories = responseData;
    });
    // LawyerClubs
    this.genParameterTypeService.getByCategory(GenParameterCategory.Visitor_LawyerClub, [this.visitor.lawyerClubPid]).subscribe((responseData: GenParameterType) => {
      this.pLawyerClubs = responseData;
    });

    // LawyerClubs
    this.genParameterService.getByCategory(GenParameterCategory.Visitor_LawyerClub, true, [this.visitor.lawyerClubPid]).subscribe(responseData => {
      this.lawyerClubs = responseData;
    });

    // RelationKinds
    this.enumService.getEnumValues('inm.core.enums.InmateRelationKind').subscribe(responseData => {
      this.relationKinds = responseData;
    });

    // OtherRelationKinds
    let otherRelationKindPids = [];
    if (this.visitor.inmateRelations) {
      this.visitor.inmateRelations.forEach(inmateRelation => {
        if (inmateRelation.otherRelationKindPid) {
          otherRelationKindPids.push(inmateRelation.otherRelationKindPid);
        }
      });
    }

    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRelation_OtherRelationKind, otherRelationKindPids).subscribe((responseData: GenParameterType) => {
      this.pOtherRelationKind = responseData;
    });

    this.countryService.getCountries(true, [this.visitor.birthCountryId]).subscribe(responseData => {
      this.allCountries = responseData;
    });

    this.addInmateRelation(false);
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.visitorForm.dirty;
  }

  saveVisitor() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.visitorService.saveVisitor(this.visitor).subscribe({
      next: (responseData: Visitor) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close(responseData);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  cancel() {
    if (this.visitorForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {
        }
      });
    } else {
      this.dynamicDialogRef.close();
    }
  }

  // -------------------------------------------------------------------------------------------------------------------

  addInmateRelation(add) {
    // tslint:disable-next-line:triple-equals
    if (this.visitor.inmateRelations.filter(item => item.inmateId === this.inmateId).length === 0) {
      let inmateRelation = new InmateRelation();
      this.visitor.inmateRelations.unshift(inmateRelation);
      inmateRelation.inmateId = this.inmateId;

      if (this.dynamicDialogConfig.data.relationKind) {
        inmateRelation.relationKind = this.dynamicDialogConfig.data.relationKind;
      }
    } else if (add === true) {
      let inmateRelation = new InmateRelation();
      this.visitor.inmateRelations.unshift(inmateRelation);
      inmateRelation.inmateId = this.inmateId;

      if (this.dynamicDialogConfig.data.relationKind) {
        inmateRelation.relationKind = this.dynamicDialogConfig.data.relationKind;
      }
    }
  }

  deleteInmateRelation(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitor.inmateRelations.splice(index, 1);
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.inmateRelationService.deleteInmateRelation(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitor.inmateRelations.splice(index, 1);
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

  // -------------------------------------------------------------------------------------------------------------------
  visitorViewLink = '/inm/visitor/view';

  homeCountryIdChanged() {
    if (this.visitor.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.visitor.homeCountryId, true, [this.visitor.homeCityId]).subscribe(responseData => {
        this.cities = responseData;
      });
    } else if (!this.visitor.homeCountryId) {
      this.cities = [];
    }
  }

  closeDialog() {
    this.dynamicDialogRef.close();
  }
}
