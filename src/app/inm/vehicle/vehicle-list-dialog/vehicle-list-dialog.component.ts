import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {vehicleConsts} from '../vehicle.consts';
import {VehicleViewDialogComponent} from '../vehicle-view-dialog/vehicle-view-dialog.component';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-inm-vehicle-list-dialog',
  templateUrl: 'vehicle-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class VehicleListDialogComponent extends DefaultValueAccessor implements OnInit {
  url = vehicleConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'plateNumber', header: this.translate.instant('vehicle.plateNumber'), sortField: 'plateNumber', width: '33rem', align: 'center'},
    {field: 'manufacturerDescription', header: this.translate.instant('vehicle.manufacturer'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '33rem', align: 'center'},
    {field: 'carModel', header: this.translate.instant('vehicle.carModel'), sortField: 'carModel', width: '33rem', align: 'center'},
  ];
  sortField = 'plateNumber';
  sortOrder = 1;
  args = this.initializeArgs();

  @ViewChild('table') table;
  selectedRowData: any;
  canCreate = false;
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private router: Router,
    private enumService: EnumService,
    private dialogService: DialogService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toitsuToasterService: ToitsuToasterService
  ) {
    super(renderer, elementRef, true);
    this.canCreate = this.dynamicDialogConfig.data['canCreate'];
  }
  ngOnInit() {}
  initializeArgs() {
    return {
      plateNumber: null,
      manufacturer: null,
      carModel: null
    };
  }
  rowDblClicked(rowData) {
    let id = rowData['id'];
    this.dynamicDialogRef.close(id);
  }
  rowSelected(rowData) {
    this.selectedRowData = rowData['data'];
  }
  rowUnselected(rowData) {
    this.selectedRowData = null;
  }
  loadTableData() {
    this.table.loadTableData();
  }
  clearArgs() {
    this.args = this.initializeArgs();
  }
  confirm() {
    if (!this.selectedRowData) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.selectedRowData['id']);
    }
  }
  cancel() {
    this.dynamicDialogRef.close();
  }
  // --------------------------------------------------------------------------
  newRecord() {
    const vehicleViewDialog = this.dialogService.open(VehicleViewDialogComponent, {
      header: this.translate.instant('inm.vehicle.new'),
      width: '50%'
    });

    vehicleViewDialog.onClose.subscribe(result => {
      if (result) {
        this.dynamicDialogRef.close(result);
      }
    });
  }
}
