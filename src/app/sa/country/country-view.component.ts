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
import {Country} from './country.model';
import {CountryService} from './country.service';
import {CityService} from '../city/city.service';
import {City} from '../city/city.model';

@Component({
  selector: 'app-sa-country-view',
  templateUrl: 'country-view.component.html'
})
export class CountryViewComponent implements OnInit, ExitConfirmation {
  id: number;
  country: Country;
  citiesActiveIndex = -1;
  
  @ViewChild(NgForm) countryForm: NgForm;
  constructor(  
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private countryService: CountryService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.country = this.id ? this.activatedRoute.snapshot.data['record'] : new Country();
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.countryForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/country/view']);
  }

  goToList() {
    this.router.navigate(['/sa/country/list']);
  }

  saveCountry() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.countryService.saveCountry(this.country).subscribe({
      next: (responseData: Country) => {
        this.toitsuToasterService.showSuccessStay();
        this.countryForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/country/view', responseData.id]);
        }
        else {
          this.country = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  deleteCountry() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.countryService.deleteCountry(this.country.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.countryForm.form.markAsPristine();
            this.router.navigate(['/sa/country/list']);
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

  deleteCity(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.country.cities.splice(index, 1);
          this.citiesActiveIndex = -1;
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.cityService.deleteCity(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.country.cities.splice(index, 1);
              this.citiesActiveIndex = -1;
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

  addCity() {
    let city = new City();
    city.isActive = true;
    this.country.cities.push(city);
    this.citiesActiveIndex = this.country.cities.length - 1;
  }
}
