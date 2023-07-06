import {Component, OnInit, ViewChild} from '@angular/core';
import { ToitsuTableComponent } from 'src/app/toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {vehicleConsts} from './vehicle.consts';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {Vehicle} from './vehicle.model';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';

@Component({
  selector: 'app-inm-vehicle-list',
  templateUrl: 'vehicle-list.component.html'
})
export class VehicleListComponent implements OnInit {

  url = vehicleConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'plateNumber', header: this.translate.instant('vehicle.plateNumber'), sortField: 'plateNumber', width: '30%', align: 'center'},
    {field: 'manufacturerDescription', header: this.translate.instant('vehicle.manufacturer'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '30%', align: 'center'},
    {field: 'carModel', header: this.translate.instant('vehicle.carModel'), sortField: 'carModel', width: '30%', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);

  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'plateNumber',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.vehicle'), 'vehicleController', 'vehicleIndex', 'inm.args.VehicleArgs');

  viewLink = '/inm/vehicle/view';

  @ViewChild('table') table: ToitsuTableComponent;

  pVehicleManufacturer = {};
  vehicle: Vehicle = new Vehicle();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuTableService: ToitsuTableService) {}

  ngOnInit() {

    this.genParameterTypeService.getByCategory(GenParameterCategory.Vehicle_Manufacturer, [this.vehicle.manufacturerPid]).subscribe(responseData => {
      this.pVehicleManufacturer = responseData;
    });
  }

  initializeArgs() {
    return {
      plateNumber: null,
      manufacturer: null,
      carModel: null
    };
  }

  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

  newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
