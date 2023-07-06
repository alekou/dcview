import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {LaborProtocolService} from './labor-protocol.service';
import {LaborDayService} from '../labor-day/labor-day.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {InmateService} from '../inmate/inmate.service';
import {LaborProtocol} from './labor-protocol.model';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-labor-protocol-view',
  templateUrl: 'labor-protocol-view.component.html'
})
export class LaborProtocolViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  laborProtocol: LaborProtocol;
  @ViewChild(NgForm) laborProtocolForm: NgForm;
  
  laborProtocolTypes = [];
  pProfessionCategory = {};
  
  inmates = [];
  inmateDialogUrl: string;
  selectedInmates = [];
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private dateService: DateService,
    private laborProtocolService: LaborProtocolService,
    private laborDayService: LaborDayService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService,
    private inmateService: InmateService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.laborProtocol = this.id ? this.route.snapshot.data['record'] : new LaborProtocol();
    
    // Get the lists
    
    this.enumService.getEnumValues('inm.core.enums.LaborProtocolType').subscribe(responseData => {
      this.laborProtocolTypes = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.Profession_Category, [this.laborProtocol.professionCategoryPid]).subscribe(responseData => {
      this.pProfessionCategory = responseData;
    });
    
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.laborProtocolForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.laborProtocol.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }
  
  laborDaysExist() {
    return (this.laborProtocol.laborDayIds.length > 0);
  }
  
  newRecord() {
    this.router.navigate(['/inm/laborprotocol/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/laborprotocol/list']);
  }
  
  /**
   * Προσθήκη κρατουμένου στα κριτήρια αναζήτησης
   */
  addNewInmateIdToArgs() {
    this.selectedInmates.push({id: null});
  }
  
  /**
   * Αφαίρεση κρατουμένου από τα κριτήρια αναζήτησης
   */
  removeInmateIdFromArgs(index) {
    this.selectedInmates.splice(index, 1);
  }
  
  /**
   * Αναζήτηση ημερομισθίων
   */
  getLaborDaysForProtocol() {
    
    let args = {
      startDate: this.laborProtocol.startDate,
      endDate: this.laborProtocol.endDate,
      laborProtocolType: this.laborProtocol.type,
      professionCategoryPid: this.laborProtocol.professionCategoryPid,
      inmateIds: this.selectedInmates.map(item => item.id)
    };
    
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.laborDayService.getLaborDaysForProtocol(args).subscribe({
      next: (responseData) => {
        this.laborProtocol.laborDayIds = responseData['laborDayIds'];
        this.laborProtocol.groupedLaborDays = responseData['groupedLaborDays'];
        
        if (this.laborProtocol.laborDayIds.length === 0) {
          this.toitsuToasterService.showInfoStay(this.translate.instant('laborProtocol.view.noLaborDaysFound'));
        }
        
        if (responseData['overlappingLaborDaysExist']) {
          this.toitsuToasterService.showInfoStay(this.translate.instant('laborProtocol.view.overlappingLaborDaysExist'));
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  /**
   * Καθαρισμός ημερομισθίων
   */
  clearLaborDays() {
    this.laborProtocol.laborDayIds = [];
    this.laborProtocol.groupedLaborDays = [];
  }
  
  /**
   * Αποθήκευση
   */
  saveLaborProtocol() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.laborProtocolService.saveLaborProtocol(this.laborProtocol).subscribe({
      next: (responseData: LaborProtocol) => {
        this.toitsuToasterService.showSuccessStay();
        this.laborProtocolForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/laborprotocol/view', responseData.id]);
        }
        else {
          this.laborProtocol = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  /**
   * Διαγραφή
   */
  deleteLaborProtocol() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.laborProtocolService.deleteLaborProtocol(this.laborProtocol.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.laborProtocolForm.form.markAsPristine();
            this.router.navigate(['/inm/laborprotocol/list']);
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

  /**
   * Έγκριση
   */
  approveLaborProtocol() {
    this.confirmationService.confirm({
      message: this.translate.instant('laborProtocol.view.approve.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.laborProtocolService.approveLaborProtocol(this.laborProtocol.id).subscribe({
          next: (responseData: LaborProtocol) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('laborProtocol.view.approve.success'));
            this.laborProtocolForm.form.markAsPristine();
            this.laborProtocol = responseData;
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
