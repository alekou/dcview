import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Vaccination} from './vaccination.model';
import {VaccinationService} from './vaccination.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {VaccineService} from '../vaccine/vaccine.service';
import {DateService} from '../../toitsu-shared/date.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-med-vaccination-view',
  templateUrl: 'vaccination-view.component.html'
})
export class VaccinationViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) vaccinationForm: NgForm;
  id: number;
  vaccination: Vaccination = new Vaccination();
  retrievedInmateId: number;
  retrievedVaccineId: number;
  retrievedCurrentDose: number;
  inmateDialogUrl: string;
  vaccines = [];
  vaccinationStatuses = [];
  
  constructor(
    private vaccinationService: VaccinationService,
    private vaccineService: VaccineService,
    public authService: AuthService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private dateService: DateService,
    private enumService: EnumService
    ) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.vaccination = this.id ? this.route.snapshot.data['record'] : new Vaccination();
    
    this.vaccineService.getAllVaccines().subscribe(responseData => {
      this.vaccines = responseData;
    });

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    this.enumService.getEnumValues('med.core.enums.VaccinationStatus').subscribe(responseData => {
      this.vaccinationStatuses = responseData;
    });

    if (!this.id) {
      this.vaccination.scheduledDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
      this.vaccination.vaccinationDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
      this.vaccination.cancelDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
      this.retrievedInmateId = +this.route.snapshot.queryParamMap.get('inmateId');
      this.retrievedVaccineId = +this.route.snapshot.queryParamMap.get('vaccineId');
      this.retrievedCurrentDose = +this.route.snapshot.queryParamMap.get('currentDose');
      this.vaccination.inmateId = this.retrievedInmateId ? this.retrievedInmateId : null;
      this.vaccination.vaccineId = this.retrievedVaccineId ? this.retrievedVaccineId : null;
      this.vaccination.currentDose = this.retrievedCurrentDose ? this.retrievedCurrentDose : 1;
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.vaccinationForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/med/vaccination/view']);
  }

  goToList() {
    this.router.navigate(['/med/vaccination/list']);
  }

  saveVaccination() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.vaccinationService.saveVaccination(this.vaccination).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.vaccinationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/med/vaccination/view/', responseData.id]);
        } else {
          this.vaccination = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVaccination() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vaccinationService.deleteVaccination(this.vaccination.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.vaccinationForm.form.markAsPristine();
            this.router.navigate(['/med/vaccination/list']);
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

  nextDose() {
    this.vaccination.currentDose++;
    this.router.navigate(['/med/vaccination/view/'], 
      {queryParams: {inmateId: this.vaccination.inmateId, vaccineId: this.vaccination.vaccineId, currentDose: this.vaccination.currentDose}});
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.vaccination.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }
}
