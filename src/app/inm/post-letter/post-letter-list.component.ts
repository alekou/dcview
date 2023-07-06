import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {postLetterConsts} from './post-letter.consts';
import {EnumService} from '../../cm/enum/enum.service';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-post-letter-list',
  templateUrl: 'post-letter-list.component.html'
})
export class PostLetterListComponent implements OnInit {

  url = postLetterConsts.indexUrl;
  postLetterTypes = [];
  inmates = [];
  inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  postLetterReceivedStatusOptions = [];

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'typeLabel', header: this.translate.instant('postLetter.type'), sortField: 'type', width: '10rem', align: 'center'},
    {field: 'reCode', header: this.translate.instant('postLetter.reCode'), sortField: 'reCode', width: '10rem', align: 'center'},
    {field: 'receiveDate', header: this.translate.instant('postLetter.receiveDate'), sortField: 'receiveDate', width: '8rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('postLetter.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'senderFullName', header: this.translate.instant('postLetter.list.sender'), sortField: 'senderLastName', width: '15rem', align: 'center'},
    {field: 'amountOfMoney', header: this.translate.instant('postLetter.amountOfMoney'), sortField: 'amountOfMoney', width: '8rem', align: 'center'},
    {field: 'employeeId', header: this.translate.instant('postLetter.employeeId'), sortField: 'employeeId', width: '15rem', align: 'center'},
    {field: 'receivedLabel', header: this.translate.instant('postLetter.received'), sortField: 'received', width: '8rem', align: 'center'},
  ];

  exportModel = new ExportModel(this.translate.instant('inm.postLetter'), 'postLetterController', 'postLetterIndex', 'inm.args.PostLetterArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'receiveDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/inm/postletter/view';

  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private enumService: EnumService ) {
  }

  ngOnInit(): void {
    // Post Letter Types
    this.enumService.getEnumValues('inm.core.enums.PostLetterType').subscribe(responseData => {
      this.postLetterTypes = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.option.PostLetterReceivedStatusOption').subscribe(responseData => {
      this.postLetterReceivedStatusOptions = responseData;
    });
  }

  initializeArgs() {
    return {
      type: null,
      receiveDateAfter: null,
      receiveDateBefore: null,
      inmateId: null,
      inmateCode: null,
      senderFullName: null,
      employeeId: null,
      reCode: null,
      postLetterReceivedStatusOption: null
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
