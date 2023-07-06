import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Visitor} from '../visitor.model';
import {VisitorService} from '../visitor.service';
import {GenParameterService} from '../../../sa/gen-parameter/gen-parameter.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuSharedService} from '../../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {InmateRelationService} from '../../inmate-relation/inmate-relation.service';
import {InmateLawyerService} from '../../inmate-lawyer/inmate-lawyer.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {inmateConsts} from '../../inmate/inmate.consts';
import {Observable} from 'rxjs';
import {InmateRelation} from '../../inmate-relation/inmate-relation.model';
import {InmateLawyer} from '../../inmate-lawyer/inmate-lawyer.model';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {CityService} from '../../../sa/city/city.service';
import {CountryService} from '../../../sa/country/country.service';
import {InmateService} from '../../inmate/inmate.service';
import {GenParameterType} from '../../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-visitor-view-dialog',
  templateUrl: 'visitor-view-dialog.component.html'
})
export class VisitorViewDialogComponent implements OnInit {
  
  createLawyer;
  id: number;

  @ViewChild(NgForm) visitorForm: NgForm;
  inmateDialogUrl: string;
  inmates = [];
  relationKinds = [];
  otherRelationKinds = [];
  visitor: Visitor;
  visitorCategories = [];
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
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private inmateRelationService: InmateRelationService,
    private inmateLawyerService: InmateLawyerService,
    private cityService: CityService,
    private countryService: CountryService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService) {

  }

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.visitor = this.id ? this.route.snapshot.data['record'] : new Visitor();

    this.createLawyer = this.dynamicDialogConfig.data['createLawyer'] ?
      this.dynamicDialogConfig.data['createLawyer'] : false; // we need ternary to handled if arg is not passed

    if (this.createLawyer) {
      this.visitor.isLawyer = true;
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
        this.dynamicDialogRef.close(responseData.id);
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
    }
    else {
      this.dynamicDialogRef.close();
    }
  }

  // -------------------------------------------------------------------------------------------------------------------

  addInmateRelation() {
    let inmateRelation = new InmateRelation();
    this.visitor.inmateRelations.push(inmateRelation);
  }

  deleteInmateRelation(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitor.inmateRelations.splice(index, 1);
        }
        else {
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

  addInmateLawyer() {
    let inmateLawyer = new InmateLawyer();
    this.visitor.inmateLawyers.push(inmateLawyer);
  }

  deleteInmateLawyer(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitor.inmateLawyers.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.inmateLawyerService.deleteInmateLawyer(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitor.inmateLawyers.splice(index, 1);
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
  
  homeCountryIdChanged() {
    if (this.visitor.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.visitor.homeCountryId, true, [this.visitor.homeCityId]).subscribe(responseData => {
        this.cities = responseData;
      });
    } else if (!this.visitor.homeCountryId) {
      this.cities = [];
    }
  }
}
