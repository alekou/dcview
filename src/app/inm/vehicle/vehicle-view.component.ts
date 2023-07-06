import {ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {VehicleService} from './vehicle.service';
import {Vehicle} from './vehicle.model';
import {VehicleDriver} from '../vehicle-driver/vehicle-driver.model';
import {DateService} from '../../toitsu-shared/date.service';
import {SelectVisitorComponent} from '../visitor/select-visitor/select-visitor.component.';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {VehicleDriverService} from '../vehicle-driver/vehicle-driver.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-vehicle-view',
  templateUrl: 'vehicle-view.component.html',
  styleUrls: ['vehicle-view.component.css']
})
export class VehicleViewComponent implements OnInit, ExitConfirmation {

  id: number;
  vehicle: Vehicle =  new Vehicle();
  
  @ViewChild(NgForm) vehicleForm: NgForm;

  @ViewChildren('visitor') selectedVisitorDriver: QueryList<SelectVisitorComponent>;
  driverActiveIndex: number = -1;
  countDrivers: number = 0;
  pVehicleManufacturer = {};
  pColor = {};
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private vehicleService: VehicleService,
    private vehicleDriverService: VehicleDriverService,
    private dateService: DateService,
    private genParameterTypeService: GenParameterTypeService)  {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // // Get the record from the route resolver or initialize a new one
    if (this.id) {
      this.vehicle = this.route.snapshot.data['record'];
      this.countDrivers = this.vehicle.vehicleDrivers.length;
    }
    
    // Vehicle Manufacturers
    this.genParameterTypeService.getByCategory(GenParameterCategory.Vehicle_Manufacturer, [this.vehicle.manufacturerPid]).subscribe((responseData: GenParameterType) => {
      this.pVehicleManufacturer = responseData;
    });
    // Vehicle Colors
    this.genParameterTypeService.getByCategory(GenParameterCategory.Vehicle_Color, [this.vehicle.colorPid]).subscribe((responseData: GenParameterType) => {
      this.pColor = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.vehicleForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/vehicle/view']);
  }

  goToList() {
    this.router.navigate(['/inm/vehicle/list']);
  }

  saveVehicle() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vehicle.vehicleDrivers.forEach(driver => {
      if (driver.isActive) {
        driver.toDate = null;
      }
    });

    this.vehicleService.saveVehicle(this.vehicle).subscribe({
      next: (responseData: Vehicle) => {
        this.toitsuToasterService.showSuccessStay();
        this.vehicleForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/vehicle/view', responseData.id]);
        }
        else {
          this.vehicle = responseData;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVehicle() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vehicleService.deleteVehicle(this.vehicle.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.vehicleForm.form.markAsPristine();
            this.router.navigate(['/inm/vehicle/list']);
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
  addDriver() {
    this.countDrivers ++;
    let vehicleDriver = new VehicleDriver();
    vehicleDriver.fromDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    vehicleDriver.toDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    this.vehicle.vehicleDrivers.push(vehicleDriver);
    this.driverActiveIndex = this.vehicle.vehicleDrivers.length - 1;
    this.changeDetectorRef.detectChanges();
  }

  onAddDriverOpen(event) {
    this.driverActiveIndex = event.index;
  }

  onAddDriverClose(event) {
    this.driverActiveIndex = -1;
  }
  
  getVisitorLabelById(visitorId) {
    if (!visitorId || !this.selectedVisitorDriver) {
      return null;
    }
    // Ανάκτηση λεκτικού επισκέπτη βάσει id από τα υπάρχοντα SelectVisitorComponents με τη χρήση του @ViewChildren
    // Παίρνουμε όλα τα SelectVisitorComponents και τα φιλτράρουμε βάσει του id επισκέπτη. Από το πρώτο που θα βρεθεί επιστρέφουμε το λεκτικό.
    let filteredVisitor = this.selectedVisitorDriver.filter(item => {
      return item.model === visitorId;
    });

    if (filteredVisitor && filteredVisitor.length > 0) {
      return filteredVisitor[0].visitorLabel;
    }
    return null;
  }
  
  deleteVehicleDriver(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
       this.countDrivers --;
       if (!id) {
          this.vehicle.vehicleDrivers.splice(index,  1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.vehicleDriverService.deleteVehicleDriver(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.vehicle.vehicleDrivers.splice(index,  1);
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
