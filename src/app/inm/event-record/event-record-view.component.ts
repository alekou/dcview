import {ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EventRecord} from './event-record.model';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {EventRecordService} from './event-record.service';
import {EventParticipant} from '../event-participant/event-participant.model';
import {EventParticipantService} from '../event-participant/event-participant.service';
import {EnumService} from '../../cm/enum/enum.service';
import {CountryService} from '../../sa/country/country.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {SelectInmateComponent} from '../inmate/select-inmate/select-inmate.component';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-event-record-view',
  templateUrl: 'event-record-view.component.html'
})
export class EventRecordViewComponent implements OnInit, ExitConfirmation {

  id: number;
  eventRecord: EventRecord = new EventRecord();
  @ViewChild(NgForm) eventRecordForm: NgForm;
  pEventType = {};
  pEventPlace = {};
  participantTypes = [];
  countries = [];
  
  inmates = [];
  // employees = [];
  
  inmateDialogUrl: string;
  // employeeDialogUrl: string;
  
  selectedInmateVictim;
  // selectedEmployeeVictim;
  
  selectedInmateCulprit;
  // selectedEmployeeCulprit;
  
  eventVictimsActiveIndex = -1;
  eventCulpritsActiveIndex = -1;

  @ViewChildren('victimInmates') victimInmates: QueryList<SelectInmateComponent>;
  // @ViewChildren('victimEmployees') victimEmployees: QueryList<SelectEmployeeComponent>;
  
  @ViewChildren('culpritInmates') culpritInmates: QueryList<SelectInmateComponent>;
  // @ViewChildren('culpritEmployees') culpritEmployees: QueryList<SelectEmployeeComponent>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private eventRecordService: EventRecordService,
    private eventParticipantService: EventParticipantService,
    private genParameterTypeService: GenParameterTypeService,
    private enumService: EnumService,
    private countryService: CountryService,
    private inmateService: InmateService
    // private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
   
    this.eventRecord = this.id ? this.route.snapshot.data['record'] : new EventRecord();
    
    // Παίρνω τις τιμές για το γέμισμα του dropdown Τύπος Συμβάντος
    this.genParameterTypeService.getByCategory(GenParameterCategory.Event_Type, [this.eventRecord.eventTypePid]).subscribe(responseData => {
      this.pEventType = responseData;
    });
    
    // Παίρνω τις λίστες δεδομένων
    this.genParameterTypeService.getByCategory(GenParameterCategory.Event_Place, [this.eventRecord.eventPlacePid]).subscribe(responseData => {
      this.pEventPlace = responseData;
    });
    
    this.enumService.getEnumValues('inm.core.enums.ParticipantType').subscribe(responseData => {
      this.participantTypes = responseData;
    });
    
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.countries = responseData;
    });
    
    if (!this.id) {
      this.inmateService.getActiveInmates().subscribe(responseData => {
        if (responseData) {
          this.inmates = responseData;
        }
      });
      this.inmateDialogUrl = inmateConsts.getActiveUrl;
    }
    if (this.id ) {
      this.inmateService.getLastRecordInmates().subscribe(responseData => {
        if (responseData) {
          this.inmates = responseData;
          this.changeDetectorRef.detectChanges();
        }
      });
      this.inmateDialogUrl = inmateConsts.getLastRecordUrl;
    }
    // // Για την αναζήτηση Employee
    // this.employeeService.getActiveEmployees().subscribe(responseData => {
    //   this.employees = responseData;
    // });
    // this.employeeDialogUrl = employeeConsts.activeIndexUrl;
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.eventRecordForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/eventrecord/view']);
  }

  goToList() {
    this.router.navigate(['/inm/eventrecord/list']);
  }

  saveEventRecord() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.eventRecordService.saveEventRecord(this.eventRecord).subscribe({
      next: (responseData: EventRecord) => {
        this.toitsuToasterService.showSuccessStay();
        this.eventRecordForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/eventrecord/view', responseData.id]);
        } else {
          this.eventRecord = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteEventRecord() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.eventRecordService.deleteEventRecord(this.eventRecord.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.eventRecordForm.form.markAsPristine();
            this.router.navigate(['/inm/eventrecord/list']);
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
  showParticipantFullName(participant: EventParticipant) {
    if (participant.inmateId) {
      if (participant.participantRole === 'VICTIM' && this.eventRecord.victimParticipants) {
        return this.getVictimLabelByInmateId(participant.inmateId);
      }
      else if (participant.participantRole === 'CULPRIT' && this.eventRecord.culpritParticipants){
        return this.getCulpritLabelByInmateId(participant.inmateId);
      }
    }
    else if (participant.employeeId) {
      // return this.getVictimLabelByEmployeeId(participant.employeeId);
    }
    else if (participant.lastName && participant.firstName) {
      return participant.lastName + ' ' + participant.firstName ;
    }
    else if (participant.lastName) {
      return participant.lastName;
    }
    else if (participant.firstName) {
      return participant.firstName;
    }
  }
  
  // Θύματα
  addEventVictim() {
    let victim = new EventParticipant();
    victim.participantRole = 'VICTIM';
    victim.eventRecordId = this.eventRecord.id;
    victim.eventTypePid = this.eventRecord.eventTypePid;
    victim.eventPlacePid = this.eventRecord.eventPlacePid;
    this.eventRecord.victimParticipants.push(victim);
    this.eventVictimsActiveIndex = this.eventRecord.victimParticipants.length - 1;
  }

  deleteEventVictim(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.eventRecord.victimParticipants.splice(index, 1);
          this.eventVictimsActiveIndex = -1;
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.eventParticipantService.deleteEventParticipant(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.eventRecord.victimParticipants.splice(index, 1);
              this.eventVictimsActiveIndex = -1;
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
  
  onEventVictimOpen(event) {
    this.eventVictimsActiveIndex = event.index;
  }

  onEventVictimClose() {
    this.eventVictimsActiveIndex = -1;
  }

  victimParticipantTypeChanged(victim: EventParticipant) {
    victim.inmateId = null;
    victim.employeeId = null;
    victim.lastName = null;
    victim.firstName = null;
    victim.nationalityId = null;
  }

  victimInmateIdChanged(victim: EventParticipant) {
    if (!victim.inmateId) {
      victim.lastName = null;
      victim.firstName = null;
      victim.nationalityId = null;
    }
    else {
      let filteredInmates = this.inmates.filter(item => {
          return item.id === victim.inmateId;
      });

      if (filteredInmates && filteredInmates.length > 0) {
  
        this.inmateService.getInmate(victim.inmateId).subscribe(responseData => {
          this.selectedInmateVictim = responseData;
  
          victim.lastName = this.selectedInmateVictim.lastName;
          victim.firstName = this.selectedInmateVictim.firstName;
          victim.nationalityId = this.selectedInmateVictim.nationalityMainId;
        });
      }
    }
  }

  // victimEmployeeIdChanged(victim: EventParticipant) {
  //   if (!victim.employeeId) {
  //     victim.lastName = null;
  //     victim.firstName = null;
  //     victim.nationalityId = null;
  //   }
  //   else {
  //     let filteredEmployees = this.employees.filter(item => {
  //       return item.id === victim.employeeId;
  //     });
  //
  //     if (filteredEmployees && filteredEmployees.length > 0) {
  //
  //       this.inmateService.getEmployee(victim.employeeId).subscribe(responseData => {
  //        this.selectedEmployeeVictim = responseData;
  //
  //         victim.lastName = this.selectedEmployeeVictim.lastName;
  //         victim.firstName = this.selectedEmployeeVictim.firstName;
  //         victim.nationalityId = this.selectedEmployeeVictim.nationalityMainId;
  //       });
  //     }
  //   }
  // }
  
  getVictimLabelByInmateId(inmateId) {
    if (!inmateId || !this.victimInmates) {
      return null;
    }
    // Ανάκτηση λεκτικού κρατουμένου βάσει id από τα υπάρχοντα SelectInmateComponents με τη χρήση του @ViewChildren
    // Παίρνουμε όλα τα SelectInmateComponents και τα φιλτράρουμε βάσει του id κρατουμένου. Από το πρώτο που θα βρεθεί επιστρέφουμε το λεκτικό.
    let filteredVictimInmates = this.victimInmates.filter(victimInmate => {
      return victimInmate.model === inmateId;
    });
    if (filteredVictimInmates && filteredVictimInmates.length > 0) {
      return filteredVictimInmates[0].getInmateFullName();
    }
    return null;
  }
  
  // getVictimLabelByEmployeeId(employeeId) {
  //   if (!employeeId || !this.victimEmployees) {
  //     return null;
  //   }
  //   let filteredVictimEmployees = this.victimEmployees.filter(item => {
  //     return item.model === employeeId;
  //   });
  //   if (filteredVictimEmployees && filteredVictimEmployees.length > 0) {
  //     return filteredVictimEmployees[0].getEmployeeFullName();
  //   }
  //   return null;
  // }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Θύτες
  addEventCulprit() {
    let culprit = new EventParticipant();
    culprit.participantRole = 'CULPRIT';
    culprit.eventRecordId = this.eventRecord.id;
    culprit.eventTypePid = this.eventRecord.eventTypePid;
    culprit.eventPlacePid = this.eventRecord.eventPlacePid;
    this.eventRecord.culpritParticipants.push(culprit);
    this.eventCulpritsActiveIndex = this.eventRecord.culpritParticipants.length - 1;
  }

  deleteEventCulprit(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.eventRecord.culpritParticipants.splice(index, 1);
          this.eventCulpritsActiveIndex = -1;
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.eventParticipantService.deleteEventParticipant(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.eventRecord.culpritParticipants.splice(index, 1);
              this.eventCulpritsActiveIndex = -1;
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

  onEventCulpritOpen(event) {
    this.eventCulpritsActiveIndex = event.index;
  }

  onEventCulpritClose() {
    this.eventCulpritsActiveIndex = -1;
  }

  culpritParticipantTypeChanged(culprit: EventParticipant) {
    culprit.inmateId = null;
    culprit.employeeId = null;
    culprit.lastName = null;
    culprit.firstName = null;
    culprit.nationalityId = null;
  }
  
  culpritInmateIdChanged(culprit: EventParticipant) {
    if (!culprit.inmateId) {
      culprit.lastName = null;
      culprit.firstName = null;
      culprit.nationalityId = null;
      culprit.isNewcomer = false;
    }
    else {
      let filteredInmates = this.inmates.filter(item => {
        return item.id === culprit.inmateId;
      });

      if (filteredInmates && filteredInmates.length > 0) {
  
        this.inmateService.getInmate(culprit.inmateId).subscribe(responseData => {
          this.selectedInmateCulprit = responseData;
    
          culprit.lastName = this.selectedInmateCulprit.lastName;
          culprit.firstName = this.selectedInmateCulprit.firstName;
          culprit.nationalityId = this.selectedInmateCulprit.nationalityMainId;
        });
      }
    }
  }

  // culpritEmployeeIdChanged(culprit: EventParticipant) {
  //   if (!culprit.employeeId) {
  //     culprit.lastName = null;
  //     culprit.firstName = null;
  //     culprit.nationalityId = null;
  //   }
  //   else {
  //     let filteredEmployees = this.employees.filter(item => {
  //       return item.id === culprit.employeeId;
  //     });
  //
  //     if (filteredEmployees && filteredEmployees.length > 0) {
  
  //       this.inmateService.getEmployee(culprit.employeeId).subscribe(responseData => {
  //        this.selectedEmployeeVictim = responseData;
  //
  //         culprit.lastName = this.selectedEmployeeCulprit.lastName;
  //         culprit.firstName = this.selectedEmployeeCulprit.firstName;
  //         culprit.nationalityId = this.selectedEmployeeCulprit.nationalityMainId;
  //       });
  //     }
  //   }
  // }
  
  getCulpritLabelByInmateId(inmateId) {
    if (!inmateId || !this.culpritInmates) {
      return null;
    }
    // Ανάκτηση λεκτικού κρατουμένου βάσει id από τα υπάρχοντα SelectInmateComponents με τη χρήση του @ViewChildren
    // Παίρνουμε όλα τα SelectInmateComponents και τα φιλτράρουμε βάσει του id κρατουμένου. Από το πρώτο που θα βρεθεί επιστρέφουμε το λεκτικό.
    let filteredCulpritInmates = this.culpritInmates.filter(item => {
      return item.model === inmateId;
    });
    if (filteredCulpritInmates && filteredCulpritInmates.length > 0) {
      return filteredCulpritInmates[0].getInmateFullName();
    }
    return null;
  }

  // getCulpritLabelByEmployeeId(employeeId) {
  //   if (!employeeId || !this.culpritEmployees) {
  //     return null;
  //   }
  //   let filteredCulpritEmployees = this.culpritEmployees.filter(item => {
  //     return item.model === employeeId;
  //   });
  //   if (filteredCulpritEmployees && filteredCulpritEmployees.length > 0) {
  //     return filteredCulpritEmployees[0].getEmployeeFullName();
  //   }
  //   return null;
  // }
}
