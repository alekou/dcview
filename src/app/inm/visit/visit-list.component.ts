import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {visitConsts} from './visit.consts';
import {VisitTypeService} from '../../sa/visit-type/visit-type.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {VisitorService} from '../visitor/visitor.service';

@Component({
  selector: 'app-inm-visitor-list',
  templateUrl: 'visit-list.component.html'
})
export class VisitListComponent implements OnInit{
  
  url = visitConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('visit.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'visitTypeDescription', header: this.translate.instant('visit.list.visitTypeDescription'), sortField: 'inm/QVisitType.visitType.description', width: '15rem', align: 'center'},
    {field: 'visitDate', header: this.translate.instant('visit.visitDate'), sortField: 'visitDate', width: '8rem', align: 'center'},
    {field: 'visitorFullName', header: this.translate.instant('visit.list.visitor'), sortField: 'inm/QVisitor.visitor.lastName', width: '15rem'},
    {field: 'relationKindLabel', header: this.translate.instant('visit.list.inmateRelation'), width: '10rem', align: 'center'},
    {field: 'inmateAreaFullDescription', header: this.translate.instant('visit.inmateAreaId'), sortField: 'inm/QArea.area.fullDescription', width: '15rem'},
    {field: 'comments', header: this.translate.instant('visit.comments'), sortField: 'comments', width: '20rem'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'visitDate',
    sortOrder: -1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.visit'), 'visitController', 'visitIndex', 'inm.args.VisitArgs');
  
  viewLink = '/inm/visit/view';

  inmates = [];
  inmateDialogUrl: string;

  visitTypes = [];
  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private visitTypeService: VisitTypeService,
    private inmateService: InmateService
  ) {}

  ngOnInit(): void {
    this.visitTypeService.getAllVisitTypes().subscribe({
      next: (responseData) => {
        if (responseData) {
          this.visitTypes = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    });

    // Inmates
    this.inmateService.getLastRecordInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  }
  
  initializeArgs() {
    return {
      inmateId: null
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
