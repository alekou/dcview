import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DetentionCenterService} from '../../sa/detention-center/detention-center.service';
import {CountryService} from '../../sa/country/country.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {ExportModel} from '../../cm/export/export.model';
import {inmateConsts} from './inmate.consts';

@Component({
  selector: 'app-inm-inmate-list',
  templateUrl: 'inmate-list.component.html'
})
export class InmateListComponent implements OnInit {
  
  url = inmateConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'viewAction', width: '5rem', align: 'center', customCell: 'cell1'},
    {field: 'folderAction', width: '3rem', align: 'center', customCell: 'cell2'},
    {field: 'laborCatalogAction', width: '3rem', align: 'center', customCell: 'cell3'},
    {field: 'status', width: '3rem', align: 'center', customCell: 'cell4'},
    {field: 'code', header: this.translate.instant('inmate.masterInmate.code'), sortField: 'inm/QMasterInmate.masterInmate.code', width: '10rem', align: 'center'},
    {field: 'inmateRecordCode', header: this.translate.instant('inmate.list.inmateRecordCode'), sortField: 'inm/QInmateRecord.inmateRecord.code', width: '8rem', align: 'center'},
    {field: 'lastName', header: this.translate.instant('inmate.lastName'), sortField: 'lastName', width: '15rem'},
    {field: 'firstName', header: this.translate.instant('inmate.firstName'), sortField: 'firstName', width: '12rem'},
    {field: 'fatherName', header: this.translate.instant('inmate.fatherName'), sortField: 'fatherName', width: '10rem'},
    {field: 'motherName', header: this.translate.instant('inmate.motherName'), sortField: 'motherName', width: '10rem'},
    {field: 'inmateRecordEntryDate', header: this.translate.instant('inmate.list.inmateRecordEntryDate'), sortField: 'inm/QInmateRecord.inmateRecord.entryDate', width: '8rem', align: 'center'},
    {field: 'inmateRecordEntryReason', header: this.translate.instant('inmate.list.inmateRecordEntryReason'), sortField: 'cm/QGenParameter.entryReason.description', width: '12rem'},
    {field: 'inmateRecordExitDate', header: this.translate.instant('inmate.list.inmateRecordExitDate'), sortField: 'inm/QInmateRecord.inmateRecord.exitDate', width: '8rem', align: 'center'},
    {field: 'inmateExitReason', header: this.translate.instant('inmate.list.inmateExitReason'), sortField: 'inm/VQInmateStatus.inmateStatus.displayDescription', width: '12rem'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'lastName',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.inmate'), 'inmateController', 'inmateIndex', 'inm.args.InmateArgs');
  
  viewLink = '/inm/inmate/view';
  folderLink = '/inm/inmate/folder';
  laborCatalogLink = '/inm/inmate/laborcatalog';

  @ViewChild('table') table: ToitsuTableComponent;
  
  detentionCenters = [];
  countries = [];
  pEntryReason = {};
  statuses = [];
  yesNoEnums = [];
  inmateRecordCategories = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
    private detentionCenterService: DetentionCenterService,
    private countryService: CountryService,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService
  ) {}
  
  ngOnInit() {
    // Get the lists
    if (this.authService.isMinistry()) {
      this.detentionCenterService.getDetentionCenters().subscribe(responseData => {
        this.detentionCenters = responseData;
      });
    }
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.countries = responseData;
    });
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_EntryReason, []).subscribe(responseData => {
      this.pEntryReason = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.option.InmateStatusOption').subscribe(responseData => {
      this.statuses = responseData;
    });
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.option.InmateRecordCategoryOption').subscribe(responseData => {
      this.inmateRecordCategories = responseData;
    });
  }
  
  initializeArgs() {
    return {
      dcId: null,
      code: null,
      lastName: null,
      firstName: null,
      fatherName: null,
      motherName: null,
      nationalityId: null,
      entryDateAfter: null,
      entryDateBefore: null,
      entryReasonPid: null,
      exitDateAfter: null,
      exitDateBefore: null,
      status: null,
      folderPossession: null,
      inmateRecordCategory: null
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
  
  getInmateStatusClass(rowData) {
    if (rowData.folderStatus === 'CLOSED') {
      return 'fa fa-times-circle-o color-red';
    }
    else if (rowData.inmateRecordStatus === 'OPEN') {
      return 'fa fa-check color-green';
    }
    else if (rowData.inmateRecordStatus === 'INABILITY') {
      return 'fa fa-bars color-purple';
    }
    else if (rowData.inmateRecordStatus === 'TEMPORARY') {
      return 'fa fa-minus color-orange';
    }
    else if (rowData.inmateRecordStatus === 'CLOSED') {
      return 'fa fa-times color-red';
    }
  }
  
  getInmateStatusTooltip(rowData) {
    if (rowData.folderStatus === 'CLOSED') {
      return this.translate.instant('inmate.list.status.folderClosed');
    }
    else if (rowData.inmateRecordStatus === 'OPEN') {
      return this.translate.instant('inmate.list.status.inmateRecordOpen');
    }
    else if (rowData.inmateRecordStatus === 'INABILITY') {
      return this.translate.instant('inmate.list.status.inmateRecordInability');
    }
    else if (rowData.inmateRecordStatus === 'TEMPORARY') {
      return this.translate.instant('inmate.list.status.inmateRecordTemporary');
    }
    else if (rowData.inmateRecordStatus === 'CLOSED') {
      return this.translate.instant('inmate.list.status.inmateRecordClosed');
    }
  }
  
  rowDblClicked(rowData) {
    if ((rowData.inmateRecordStatus !== 'CLOSED') || rowData.lastRecord || this.authService.isMinistry()) {
      this.router.navigate([this.viewLink, rowData.id]);
    }
  }
  
  goToOldList() {
    this.router.navigate(['/inm/inmate/oldlist']);
  }
  
  goToPhotoList() {
    this.router.navigate(['/inm/inmate/photolist']);
  }
}
