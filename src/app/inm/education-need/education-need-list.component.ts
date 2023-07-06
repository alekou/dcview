import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {educationNeedConsts} from './education-need.consts';

@Component({
  selector: 'app-inm-education-need-list',
  templateUrl: 'education-need-list.component.html'
})
export class EducationNeedListComponent implements OnInit{
  url = educationNeedConsts.indexUrl;
  inmatesUrl = inmateConsts.activeIndexUrl;
  inmates = [];
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('educationNeed.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'submitDate', header: this.translate.instant('educationNeed.submitDate'), sortField: 'submitDate', width: '8rem', align: 'center'},
    {field: 'individualTeachingLabel', header: this.translate.instant('educationNeed.individualTeachingInterest'), sortField: 'individualTeaching', width: '10rem', align: 'center'},
    {field: 'tertiaryEducationInterestLabel', header: this.translate.instant('educationNeed.tertiaryEducationInterest'), sortField: 'tertiaryEducationInterest', width: '10rem', align: 'center'}
  ];

  exportModel = new ExportModel(this.translate.instant('inm.educationNeed'), 'educationNeedController', 'educationNeedIndex', 'inm.args.EducationNeedArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'submitDate',
    sortOrder: -1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/inm/educationneed/view';
  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private inmateService: InmateService) {
  }

  ngOnInit(): void {
    this.inmateService.getActiveInmates().subscribe({
      next: (responseData) => {this.inmates = responseData;
      }
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      inmateCode: null,
      submitDateAfter: null,
      submitDateBefore: null
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
