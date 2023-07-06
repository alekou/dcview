import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LaborCatalog} from './labor-catalog.model';
import {laborCatalogConsts} from './labor-catalog.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-labor-catalog-excerpt-list',
  templateUrl: 'labor-catalog-excerpt-list.component.html'
})
export class LaborCatalogExcerptListComponent implements OnInit {

  @Input() model: LaborCatalog = null;

  url = laborCatalogConsts.catalogExcerptIndexUrl;
  historyUrl = laborCatalogConsts.catalogExcerptHistoryIndexUrl;

  cols: any[] = null;
  paging = null;
  args = null;

  exportModel = null;
  exportHistoryModel = null;

  @ViewChild('table') table: ToitsuTableComponent;
  @ViewChild('historyTable') historyTable: ToitsuTableComponent;

  yesNoEnums = [];

  selectedRecord = null;

  constructor(
    private enumService: EnumService,
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Αρχικοποίηση μεταβλητών βάσει του επιλεγμένου κρατουμένου
    if (this.model != null) {
      this.cols = this.initializeCols();
      this.paging = this.initializePaging();
      this.args = this.initializeArgs();
      this.exportModel = this.initializeExportModel();
      this.exportHistoryModel = this.initializeExportHistoryModel();

      // Ανάκτηση λιστών
      this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
        this.yesNoEnums = responseData;
      });
    }
  }

  initializeCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'customExtraActions', width: '3rem', customCell: 'cell1', align: 'center'},
      {field: 'protocolNo', header: this.translate.instant('laborProtocol.protocolNo'), width: '15rem', align: 'center'},
      {field: 'judgmentNo', header: this.translate.instant('judgment.judgmentNo'), sortField: 'judgmentNo', width: '10rem', align: 'center'},
      {field: 'dcName', header: this.translate.instant('laborProtocol.lists.dcName'), width: '15rem'},
      {field: 'startDate', header: this.translate.instant('laborCatalog.lists.dateFrom'), width: '10rem', align: 'center'},
      {field: 'endDate', header: this.translate.instant('laborCatalog.lists.dateTo'), width: '10rem', align: 'center'},
      {field: 'approvalDate', header: this.translate.instant('laborProtocol.approvalDate'), width: '8rem', align: 'center'},
      {field: 'factorString', header: this.translate.instant('laborDay.factor'), width: '8rem', align: 'center'},
      {field: 'workDays', header: this.translate.instant('laborDay.workDays'), width: '8rem', align: 'center'},
      {field: 'beneficialCalculation', header: this.translate.instant('laborCatalog.lists.beneficialCalculation'), width: '10rem', align: 'center'},
    ];
  }

  initializePaging() {
    return {
      first: this.toitsuTableService.FIRST,
      rows: this.toitsuTableService.ROWS,
      sortField: 'id',
      sortOrder: -1
    };
  }

  initializeArgs() {
    return {
      inmateId: this.model.inmate.id,
      dateAfter: null,
      dateBefore: null,
      approved: null,
      factor: null
    };
  }

  initializeExportModel() {
    return new ExportModel(this.translate.instant('inm.laborCatalog.inmateExcerpt') + ' - ' + this.model.inmate.fullName,
      'laborCatalogController', 'catalogExcerptIndex', 'inm.args.LaborCatalogExcerptArgs');
  }

  initializeExportHistoryModel() {
    return new ExportModel(this.translate.instant('inm.laborCatalog.inmateExcerptHistory') + ' - ' + this.model.inmate.fullName,
      'laborCatalogController', 'catalogExcerptHistoryIndex', 'inm.args.LaborCatalogExcerptArgs');
  }

  loadTableData() {
    this.table.loadTableData();
    this.historyTable.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }


  onSelectRecord() {
    // Άντληση πληροφοριών επιλεγμένης εγγραφής από τον πίνακα κρατουμένων
    this.selectedRecord = this.table.selectedItems;

    // Αρχικοποίηση του συντελεστή για αναζήτηση
    this.args.factor = this.selectedRecord.factor;

    // Ανανέωση δεδομένων του πίνακα ιστορικού
    this.historyTable.loadTableData();

    // Αρχικοποίηση args
    this.args.factor = null;
  }

  onUnselectRecord() {
    this.selectedRecord = null;
    this.args.factor = null;
  }
}
