import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {placementProtocolConsts} from './placement-protocol.consts';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-placement-protocol-list',
  templateUrl: 'placement-protocol-list.component.html'
})
export class PlacementProtocolListComponent implements OnInit {

  url = placementProtocolConsts.indexUrl;

  yesNoEnums = [];

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'compositionDate', header: this.translate.instant('placementProtocol.compositionDate'), sortField: 'compositionDate', width: '10rem', align: 'center'},
    {field: 'placementFromDate', header: this.translate.instant('placementProtocol.placementFromDate'), sortField: 'placementFromDate', width: '10rem', align: 'center'},
    {field: 'placementToDate', header: this.translate.instant('placementProtocol.placementToDate'), sortField: 'placementToDate', width: '10rem', align: 'center'},
    {field: 'approvedLabel', header: this.translate.instant('placementProtocol.approved'), width: '10rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('placementProtocol.protocolNo'), sortField: 'protocolNo', width: '10rem'},
    {field: 'protocolDate', header: this.translate.instant('placementProtocol.protocolDate'), sortField: 'protocolDate', width: '10rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'compositionDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.placementProtocol'), 'placementProtocolController', 'placementProtocolIndex', 'inm.args.PlacementProtocolArgs');

  viewLink = '/inm/placementprotocol/view';

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private enumService: EnumService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private translate: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Φόρτωση λιστών
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption')
      .subscribe(responseData => {
        this.yesNoEnums = responseData;
      });

  }

  initializeArgs() {
    return {
      compositionDateAfter: null,
      compositionDateBefore: null,
      approved: null,
      protocolNo: null,
      protocolDateAfter: null,
      protocolDateBefore: null
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
