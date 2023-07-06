import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {EnumService} from '../../cm/enum/enum.service';
import {CountryService} from '../../sa/country/country.service';
import {ExportModel} from '../../cm/export/export.model';
import {inmateConsts} from '../../inm/inmate/inmate.consts';

@Component({
  selector: 'app-med-medical-folder-list',
  templateUrl: 'medical-folder-list.component.html'
})
export class MedicalFolderListComponent implements OnInit {

  url = inmateConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'code', header: this.translate.instant('inmate.masterInmate.code'), sortField: 'inm/QMasterInmate.masterInmate.code', width: '10rem', align: 'center'},
    {field: 'inmateRecordCode', header: this.translate.instant('inmate.list.inmateRecordCode'), sortField: 'inm/QInmateRecord.inmateRecord.code', width: '8rem', align: 'center'},
    {field: 'lastName', header: this.translate.instant('inmate.lastName'), sortField: 'lastName', width: '15rem'},
    {field: 'firstName', header: this.translate.instant('inmate.firstName'), sortField: 'firstName', width: '12rem'},
    {field: 'fatherName', header: this.translate.instant('inmate.fatherName'), sortField: 'fatherName', width: '10rem'},
    {field: 'motherName', header: this.translate.instant('inmate.motherName'), sortField: 'motherName', width: '10rem'},
    {field: 'inmateRecordEntryDate', header: this.translate.instant('inmate.list.inmateRecordEntryDate'), sortField: 'inm/QInmateRecord.inmateRecord.entryDate', width: '8rem', align: 'center'},
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

  viewLink = '/med/medicalfolder/view';

  @ViewChild('table') table: ToitsuTableComponent;
  countries = [];
  statuses = [];
  yesNoEnums = [];
  inmateRecordCategories = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,
    private countryService: CountryService
  ) {}

  ngOnInit() {
    // Get the lists
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.countries = responseData;
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
  
  rowDblClicked(rowData) {
    this.router.navigate([this.viewLink, rowData.id]);
  }

  displayPicture() {
    
  }
}
