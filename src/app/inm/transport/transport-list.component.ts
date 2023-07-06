import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {transportConsts} from './transport.consts';
import {inmateConsts} from '../inmate/inmate.consts';
import {EnumService} from '../../cm/enum/enum.service';
import {CountryService} from '../../sa/country/country.service';

@Component({
  selector: 'app-inm-transport-list',
  templateUrl: 'transport-list.component.html'
})
export class TransportListComponent implements OnInit {
  
  url = transportConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('transport.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'statusLabel', header: this.translate.instant('transport.status'), sortField: 'status', width: '10rem', align: 'center'},
    {field: 'approvalDate', header: this.translate.instant('transport.approvalDate'), sortField: 'approvalDate', width: '10rem', align: 'center'},
    {field: 'convictionCountry', header: this.translate.instant('transport.convictionCountryId'), sortField: 'inm/QCountry.country.countryNameGreek', width: '10rem', align: 'center'},
    {field: 'executionCountry', header: this.translate.instant('transport.executionCountryId'), sortField: 'inm/QCountry.country.countryNameGreek', width: '10rem', align: 'center'},
    {field: 'nationalityMain', header: this.translate.instant('transport.nationalityMainId'), sortField: 'inm/QCountry.country.nationalityNameGreek', width: '10rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'status',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.transport'), 'transportController', 'transportIndex', 'inm.args.TransportArgs');
  
  viewLink = '/inm/transport/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  inmateDialogUrl: string;
  transportStatuses = [];
  countries = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,
    private countryService: CountryService
  ) {}
  
  ngOnInit() {
    // Inmates
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  
    this.enumService.getEnumValues('inm.core.enums.TransportStatus').subscribe(responseData => {
      this.transportStatuses = responseData;
    });
  
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.countries = responseData;
    });
  }
  
  // Κριτήρια αναζήτησης: δηλώνω τα ονόματα *ακριβώς* όπως δηλώθηκαν στο TransportArgs
  initializeArgs() {
    return {
      dcId: null,
      inmateId: null,
      inmateCode: null,
      status: null,
      approvalDateAfter: null,
      approvalDateBefore: null,
      nationalityMainId: null
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
