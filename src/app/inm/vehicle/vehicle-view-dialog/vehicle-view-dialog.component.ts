import {Component, OnInit} from '@angular/core';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {VehicleService} from '../vehicle.service';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Vehicle} from '../vehicle.model';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../../../sa/gen-parameter-type/gen-parameter-type.model';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-vehicle-view-dialog',
  templateUrl: 'vehicle-view-dialog.component.html'
})
export class VehicleViewDialogComponent implements OnInit {
  pVehicleManufacturer = {};
  pColor = {};
  vehicle: Vehicle = new Vehicle();
  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuToasterService: ToitsuToasterService,
    private vehicleService: VehicleService,
    private toitsuBlockUiService: ToitsuBlockUiService) {}

  ngOnInit() {
    // Vehicle Manufacturers
    this.genParameterTypeService.getByCategory(GenParameterCategory.Vehicle_Manufacturer, [this.vehicle.manufacturerPid]).subscribe((responseData: GenParameterType) => {
      this.pVehicleManufacturer = responseData;
    });
    // Vehicle Colors
    this.genParameterTypeService.getByCategory(GenParameterCategory.Vehicle_Color, [this.vehicle.colorPid]).subscribe((responseData: GenParameterType) => {
      this.pColor = responseData;
    });
  }

  saveVehicle() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.vehicleService.saveVehicle(this.vehicle).subscribe({
      next: (responseData: Vehicle) => {
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
    this.dynamicDialogRef.close();
  }
}
