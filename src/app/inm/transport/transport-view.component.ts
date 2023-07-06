import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {Transport} from './transport.model';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {TransportService} from './transport.service';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {CountryService} from '../../sa/country/country.service';
import {EnumService} from '../../cm/enum/enum.service';
import {CityService} from '../../sa/city/city.service';

@Component({
  selector: 'app-inm-transport-view',
  templateUrl: 'transport-view.component.html'
})
export class TransportViewComponent implements OnInit, ExitConfirmation {
  id: number;
  transport: Transport;
  @ViewChild(NgForm) transportForm: NgForm;
  inmates = [];
  inmateDialogUrl: string;
  selectedInmate ;
  genders = [];
  countries = [];
  birthCities = [];
  authorities = [];
  facts = [];
  transportStatuses = [];
  requestStatuses = [];
  sentences = [];

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private transportService: TransportService,
    private genParameterService: GenParameterService,
    private inmateService: InmateService,
    private countryService: CountryService,
    private cityService: CityService,
    private enumService: EnumService
  ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.transport = this.id ? this.route.snapshot.data['record'] : new Transport();
  
    // Παίρνω τις λίστες δεδομένων
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  
    this.enumService.getEnumValues('cm.core.enums.Gender').subscribe(responseData => {
      this.genders = responseData;
    });
  
    this.countryService.getCountries(true, [this.transport.birthCountryId, this.transport.nationalityMainId, 
                                      this.transport.convictionCountryId, this.transport.executionCountryId]).subscribe(responseData => {
      this.countries = responseData;
    });
  
    if (this.transport.birthCountryId) {
      this.cityService.getCitiesByCountryId(this.transport.birthCountryId, true, [this.transport.birthCityId]).subscribe(responseData => {
        this.birthCities = responseData;
      });
    }
  
    this.enumService.getEnumValues('inm.core.enums.TransportStatus').subscribe(responseData => {
      this.transportStatuses = responseData;
    });
  
    this.genParameterService.getByCategory(GenParameterCategory.Transport_RequestStatus, true, [this.transport.requestStatusPid]).subscribe(responseData => {
      this.requestStatuses = responseData;
    });
  
    this.genParameterService.getByCategory(GenParameterCategory.Transport_Authority, true, [this.transport.authorityPid]).subscribe(responseData => {
      this.authorities = responseData;
    });
  
    this.genParameterService.getByCategory(GenParameterCategory.Judgment_Fact, true, [this.transport.factPid]).subscribe(responseData => {
      this.facts = responseData;
    });
  
    this.genParameterService.getByCategory(GenParameterCategory.Judgment_Sentence, true, [this.transport.sentencePid]).subscribe(responseData => {
      this.sentences = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.transportForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.transport.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/transport/view']);
  }

  goToList() {
    this.router.navigate(['/inm/transport/list']);
  }

  saveTransport() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.transportService.saveTransport(this.transport).subscribe({
      next: (responseData: Transport) => {
        this.toitsuToasterService.showSuccessStay();
        this.transportForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/transport/view', responseData.id]);
        } else {
          this.transport = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
        this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteTransport() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.transportService.deleteTransport(this.transport.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.transportForm.form.markAsPristine();
            this.router.navigate(['/inm/transport/list']);
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
  
  inmateIdChanged(transport: Transport) {
    if (!transport.inmateId) {
      transport.lastName = null;
      transport.firstName = null;
      transport.birthYear = null;
      transport.gender = null;
      transport.nationalityMainId = null;
      transport.nickName = null;
      transport.gender = null;
      transport.fatherName = null;
      transport.motherName = null;
      transport.motherGenos = null;
      transport.adt = null;
      transport.passport = null;
      transport.afm = null;
      transport.birthCountryId = null;
      transport.birthCityId = null;
      transport.birthDate = null;
      transport.birthYear = null;
    }
    else {
      let filteredInmates = this.inmates.filter(item => {
        return item.id === transport.inmateId;
      });
      
      if (filteredInmates && filteredInmates.length > 0) {
  
        this.inmateService.getInmate(transport.inmateId).subscribe(responseData => {
          this.selectedInmate = responseData;
          
          transport.lastName = this.selectedInmate.lastName;
          transport.firstName = this.selectedInmate.firstName;
          transport.nickName = this.selectedInmate.nickName;
          transport.gender = this.selectedInmate.gender;
          transport.fatherName = this.selectedInmate.fatherName;
          transport.motherName = this.selectedInmate.motherName;
          transport.motherGenos = this.selectedInmate.motherGenos;
          transport.adt = this.selectedInmate.adt;
          transport.passport = this.selectedInmate.passport;
          transport.afm = this.selectedInmate.afm;
          transport.birthCountryId = this.selectedInmate.birthCountryId;
          this.birthCountryIdChanged();
          transport.birthCityId = this.selectedInmate.birthCityId;
          transport.birthDate = this.selectedInmate.birthDate;
          transport.birthYear = this.selectedInmate.birthYear;
          transport.nationalityMainId = this.selectedInmate.nationalityMainId;
          
        });
      }
    }
  }
  
  birthCountryIdChanged() {
    if (this.transport.birthCountryId) {
      this.cityService.getCitiesByCountryId(this.transport.birthCountryId, true, [this.transport.birthCityId]).subscribe(responseData => {
        this.birthCities = responseData;
      });
    } else {
      this.birthCities = [];
    }
  }
  
  statusChanged(transport: Transport) {
    if (transport.status !== 'APPROVED'){
      transport.approvalDate = null;
    }
  }
}
