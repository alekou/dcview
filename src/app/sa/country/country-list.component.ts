import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {countryConsts} from './country.consts';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-sa-country-list',
  templateUrl: 'country-list.component.html'
})
export class CountryListComponent implements OnInit{

  url = countryConsts.indexUrl;
  yesNoEnums = [];
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'threeDigitCode', header: this.translate.instant('country.threeDigitCode'), sortField: 'threeDigitCode', width: '7rem', align: 'center'},
    {field: 'countryNameGreek', header: this.translate.instant('country.countryNameGreek'), sortField: 'countryNameGreek', width: '15rem'},
    {field: 'countryNameLatin', header: this.translate.instant('country.countryNameLatin'), sortField: 'countryNameLatin', width: '15rem'}
  ];
  exportModel = new ExportModel(this.translate.instant('sa.country'), 'countryController', 'countryIndex', 'cm.args.CountryArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'countryNameGreek',
    sortOrder: 1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/sa/country/view';
  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private enumService: EnumService){
  }

  ngOnInit(): void {
    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }

initializeArgs() {
    return {
      isActive: 'YES'
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
    this.args.isActive = 'NO';
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
