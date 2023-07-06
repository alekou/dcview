import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {VisitorService} from './visitor.service';
import {InmateRelationService} from '../inmate-relation/inmate-relation.service';
import {InmateLawyerService} from '../inmate-lawyer/inmate-lawyer.service';
import {InmateService} from '../inmate/inmate.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {Visitor} from './visitor.model';
import {InmateRelation} from '../inmate-relation/inmate-relation.model';
import {InmateLawyer} from '../inmate-lawyer/inmate-lawyer.model';
import {SelectInmateComponent} from '../inmate/select-inmate/select-inmate.component';
import {inmateConsts} from '../inmate/inmate.consts';
import {CityService} from '../../sa/city/city.service';
import {CountryService} from '../../sa/country/country.service';
import {VisitBan} from '../visit-ban/visit-ban.model';
import {VisitBanService} from '../visit-ban/visit-ban.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-visitor-view',
  templateUrl: 'visitor-view.component.html'
})
export class VisitorViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  visitor: Visitor;
  @ViewChild(NgForm) visitorForm: NgForm;
  
  inmates = [];
  inmateDialogUrl: string;
  visitorCategories = [];
  lawyerClubs = [];
  relationKinds = [];
  otherRelationKinds = [];
  allCountries = [];
  cities = [];
  pOtherRelationKind = {};
  
  inmateLawyersActiveIndex = -1;
  @ViewChildren('inmatesOfLawyers') inmatesOfLawyers: QueryList<SelectInmateComponent>;
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private visitorService: VisitorService,
    private inmateRelationService: InmateRelationService,
    private inmateLawyerService: InmateLawyerService,
    private visitBanService: VisitBanService,
    private inmateService: InmateService,
    private cityService: CityService,
    private countryService: CountryService,
    private enumService: EnumService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.visitor = this.id ? this.route.snapshot.data['record'] : new Visitor();
    
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

    if (this.visitor.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.visitor.homeCountryId, true, [this.visitor.homeCityId]).subscribe(responseData => {
        this.cities = responseData;
      });
    }
    
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.visitorForm.dirty;
  }
  
  newRecord() {
    this.router.navigate(['/inm/visitor/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/visitor/list']);
  }
  
  saveVisitor() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.visitorService.saveVisitor(this.visitor).subscribe({
      next: (responseData: Visitor) => {
        this.toitsuToasterService.showSuccessStay();
        this.visitorForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/visitor/view', responseData.id]);
        }
        else {
          this.visitor = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteVisitor() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.visitorService.deleteVisitor(this.visitor.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.visitorForm.form.markAsPristine();
            this.router.navigate(['/inm/visitor/list']);
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
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  // Inmate Relations
  
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
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  // Inmate Lawyers
  
  addInmateLawyer() {
    let inmateLawyer = new InmateLawyer();
    this.visitor.inmateLawyers.push(inmateLawyer);
    this.inmateLawyersActiveIndex = this.visitor.inmateLawyers.length - 1;
  }
  
  deleteInmateLawyer(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitor.inmateLawyers.splice(index, 1);
          this.inmateLawyersActiveIndex = -1;
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          
          this.inmateLawyerService.deleteInmateLawyer(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitor.inmateLawyers.splice(index, 1);
              this.inmateLawyersActiveIndex = -1;
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
  
  onInmateLawyerOpen(event) {
    this.inmateLawyersActiveIndex = event.index;
  }
  
  onInmateLawyerClose(event) {
    this.inmateLawyersActiveIndex = -1;
  }
  
  getInmateOfLawyerLabelById(inmateId) {
    if (!inmateId || !this.inmatesOfLawyers) {
      return null;
    }
    
    // Ανάκτηση λεκτικού κρατουμένου βάσει id από τα υπάρχοντα SelectInmateComponents με τη χρήση του @ViewChildren
    // Παίρνουμε όλα τα SelectInmateComponents και τα φιλτράρουμε βάσει του id κρατουμένου. Από το πρώτο που θα βρεθεί επιστρέφουμε το λεκτικό.
    let filteredInmatesOfLawyers = this.inmatesOfLawyers.filter(item => {
      return item.model === inmateId;
    });
    if (filteredInmatesOfLawyers && filteredInmatesOfLawyers.length > 0) {
      return filteredInmatesOfLawyers[0].getInmateFullName();
    }
    
    return null;
  }

  homeCountryIdChanged() {
    if (this.visitor.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.visitor.homeCountryId, true, [this.visitor.homeCityId]).subscribe(responseData => {
        this.cities = responseData;
      });
    } else {
      this.cities = [];
    }
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // Visit Bans

  addVisitBan() {
    

    if (this.visitor.id) {
      let visitBan = new VisitBan();
      this.visitor.visitBans.push(visitBan);
      this.inmateLawyersActiveIndex = this.visitor.visitBans.length - 1;
    } else {
      this.toitsuToasterService.showErrorStay(this.translate.instant('Δεν έχετε επιλέξει επισκέπτη προς απαγόρευση.'));
      this.toitsuBlockUiService.unblockUi();
    }
  }

  deleteVisitBan(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitor.visitBans.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.visitBanService.deleteVisitBan(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitor.visitBans.splice(index, 1);
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
