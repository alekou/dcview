import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {laborCatalogConsts} from './labor-catalog.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {LaborCatalog} from './labor-catalog.model';
import {EnumService} from '../../cm/enum/enum.service';
import {JudgmentService} from '../judgment/judgment.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-labor-catalog-labor-day-list',
  templateUrl: 'labor-catalog-labor-day-list.component.html'
})
export class LaborCatalogLaborDayListComponent implements OnInit {

  @Input() model: LaborCatalog = null;

  url = laborCatalogConsts.catalogLaborDayIndexUrl;

  cols: any[] = null;
  paging = null;
  args = null;

  viewLink = '/inm/laborday/view';

  exportModel = null;

  @ViewChild('table') table: ToitsuTableComponent;

  laborDayCategories = [];
  inmateJudgmentDecisions = [];
  yesNoEnums = [];

  constructor(
    private enumService: EnumService,
    private judgmentService: JudgmentService,
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
      // Ανάκτηση λίστας αποφάσεων κρατουμένου
      this.judgmentService.getJudgmentMiniListByInmate(this.model.inmate.id).subscribe(responseData => {
        this.inmateJudgmentDecisions = responseData;
      });
    }

    // Ανάκτηση λιστών
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.option.LaborDayCategoryOption').subscribe(responseData => {
      this.laborDayCategories = responseData;
    });
  }

  initializeCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'extraActions', width: '5rem', align: 'center'},
      {field: 'professionName', header: this.translate.instant('laborDay.professionId'), sortField: 'inm/QProfession.profession.name', width: '15rem'},
      {field: 'laborDate', header: this.translate.instant('laborDay.list.laborDate'), sortField: 'laborDate', width: '8rem', align: 'center'},
      {field: 'laborDateTo', header: this.translate.instant('laborDay.list.laborDateTo'), sortField: 'laborDateTo', width: '8rem', align: 'center'},
      {field: 'presenceLabel', header: this.translate.instant('laborDay.presence'), sortField: 'presence', width: '7rem', align: 'center'},
      {field: 'factorString', header: this.translate.instant('laborDay.factor'), sortField: 'factor', width: '8rem', align: 'center'},
      {field: 'workDays', header: this.translate.instant('laborDay.workDays'), sortField: 'workDays', width: '8rem', align: 'center'},
      {field: 'beneficialCalculation', header: this.translate.instant('laborCatalog.lists.beneficialCalculation'), width: '10rem', align: 'center'},
      {field: 'approvedLabel', header: this.translate.instant('laborDay.approved'), sortField: 'approved', width: '6rem', align: 'center'},
      {field: 'censusLabel', header: this.translate.instant('laborDay.census'), sortField: 'census', width: '8rem', align: 'center'},
      {field: 'creationDate', header: this.translate.instant('laborDay.creationDate'), sortField: 'creationDate', width: '8rem', align: 'center'},
      {field: 'judgmentDisplayName', header: this.translate.instant('inmateLaborDays.list.judgmentId'), width: '15rem', align: 'center'}
    ];
  }

  initializePaging() {
    return {
      first: this.toitsuTableService.FIRST,
      rows: this.toitsuTableService.ROWS,
      sortField: 'laborDate',
      sortOrder: -1
    };
  }

  initializeArgs() {
    return {
      inmateId: this.model.inmate.id,
      laborDateAfter: null,
      laborDateBefore: null,
      laborDateToAfter: null,
      laborDateToBefore: null,
      judgmentId: null,
      census: null,
      category: null,
      presence: null,
      linkedToProtocol: null,
      approved: null
    };
  }

  initializeExportModel() {
    return new ExportModel(this.translate.instant('inm.laborCatalog.inmateLaborDays') + ' - ' + this.model.inmate.fullName,
      'laborCatalogController', 'catalogLaborDayIndex', 'inm.args.LaborCatalogLaborDayArgs');
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

}
