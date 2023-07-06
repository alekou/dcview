import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ExportModel} from '../../cm/export/export.model';
import {templateConsts} from './template.consts';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {TemplateService} from './template.service';

@Component({
  selector: 'app-sa-template-list',
  templateUrl: 'template-list.component.html'
})

export class TemplateListComponent implements OnInit {
  
  url = templateConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', header: '', sortField: '', width: '5%'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), sortField: '', width: '5%', align: 'center'},
    {field: 'title', header: this.translate.instant('template.title'), sortField: 'title', width: '30%'},
    {field: 'entityLabel', header: this.translate.instant('template.entity'), sortField: 'entity', width: '30%'},
    {field: 'reportCode', header: this.translate.instant('template.reportCode'), sortField: 'reportCode', width: '30%'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'id',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);

  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('tr.template'), 'templateController', 'templateIndex', 'tr.args.TemplateArgs');
  
  viewLink = '/sa/template/view';
  
  @ViewChild('table') table;
  
  entities = [];
  templateDefinitions = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,
    private templateService: TemplateService
  ) {}
  
  ngOnInit() {
    this.enumService.getEnumValues('tr.core.enums.TrEntity').subscribe(responseData => {
      this.entities = responseData;
    });
    this.templateService.getMainDatasets().subscribe(responseData => {
      this.templateDefinitions = responseData;

    });
  }
  
  initializeArgs() {
    return {
      
    };
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
  }
  
  newRecord() {
    this.router.navigate(['/sa/template/view']);
  }
}
