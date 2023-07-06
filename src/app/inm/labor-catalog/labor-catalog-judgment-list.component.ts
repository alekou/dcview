import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LaborCatalog} from './labor-catalog.model';
import {laborCatalogConsts} from './labor-catalog.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';

@Component({
  selector: 'app-inm-labor-catalog-judgment-list',
  templateUrl: 'labor-catalog-judgment-list.component.html'
})
export class LaborCatalogJudgmentListComponent implements OnInit {

  @Input() model: LaborCatalog = null;

  url = laborCatalogConsts.catalogJudgmentIndexUrl;

  cols: any[] = null;
  paging = null;
  args = null;

  exportModel = null;

  @ViewChild('table') table: ToitsuTableComponent;


  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
  ) {
  }

  ngOnInit(): void {
    // Αρχικοποίηση μεταβλητών βάσει του επιλεγμένου κρατουμένου
    if (this.model != null) {
      this.cols = this.initializeCols();
      this.paging = this.initializePaging();
      this.args = this.initializeArgs();
      this.exportModel = this.initializeExportModel();
    }
  }

  initializeCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'judgmentNo', header: this.translate.instant('judgment.judgmentNo'), sortField: 'judgmentNo', width: '10rem'},
      {field: 'judgmentDate', header: this.translate.instant('judgment.judgmentDate'), sortField: 'judgmentDate', width: '8rem', align: 'center'},
      {field: 'typeLabel', header: this.translate.instant('judgment.type'), width: '10rem', sortField: 'type', align: 'center'},
      {field: 'currentLabel', header: this.translate.instant('judgment.current'), sortField: 'current', width: '8rem', align: 'center'},
      {field: 'cancelledLabel', header: this.translate.instant('judgment.cancelled'), sortField: 'cancelled', width: '8rem', align: 'center'},
      {field: 'mergingLabel', header: this.translate.instant('judgment.merging'), sortField: 'merging', width: '8rem', align: 'center'},
      {field: 'mergedLabel', header: this.translate.instant('judgment.merged'), sortField: 'merged', width: '8rem', align: 'center'},
      {field: 'completedLabel', header: this.translate.instant('judgment.completed'), sortField: 'completed', width: '8rem', align: 'center'},
      {field: 'beneficialCalculation', header: this.translate.instant('laborCatalog.lists.beneficialCalculation'), width: '10rem', align: 'center'}
    ];
  }

  initializePaging() {
    return {
      first: this.toitsuTableService.FIRST,
      rows: this.toitsuTableService.ROWS,
      sortField: 'judgmentDate',
      sortOrder: -1
    };
  }

  initializeArgs() {
    return {
      inmateId: this.model.inmate.id,
    };
  }

  initializeExportModel() {
    return new ExportModel(this.translate.instant('inm.laborCatalog.inmateJudgments') + ' - ' + this.model.inmate.fullName,
      'laborCatalogController', 'catalogJudgmentIndex', 'inm.args.LaborCatalogJudgmentArgs');
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }


}
