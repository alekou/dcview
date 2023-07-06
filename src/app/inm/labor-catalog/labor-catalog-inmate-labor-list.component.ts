import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LaborCatalog} from './labor-catalog.model';
import {laborCatalogConsts} from './labor-catalog.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {EnumService} from '../../cm/enum/enum.service';
import {JudgmentService} from '../judgment/judgment.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {ProfessionService} from '../../sa/profession/profession.service';

@Component({
  selector: 'app-inm-labor-catalog-inmate-labor-list',
  templateUrl: 'labor-catalog-inmate-labor-list.component.html'
})
export class LaborCatalogInmateLaborListComponent implements OnInit {

  @Input() model: LaborCatalog = null;

  url = laborCatalogConsts.catalogInmateLaborIndexUrl;

  cols: any[] = null;
  paging = null;
  args = null;

  viewLink = '/inm/inmatelabor/view';

  exportModel = null;

  @ViewChild('table') table: ToitsuTableComponent;


  inmateLaborCategories = [];
  professions = [];

  constructor(
    private professionService: ProfessionService,
    private enumService: EnumService,
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

    // Ανάκτηση λιστών
    this.enumService.getEnumValues('inm.core.enums.option.InmateLaborCategoryOption').subscribe(responseData => {
      this.inmateLaborCategories = responseData;
    });
    this.professionService.getActiveProfessionsByUserDc([]).subscribe(responseData => {
      this.professions = responseData;
    });
  }

  initializeCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'extraActions', width: '5rem', align: 'center'},
      {field: 'professionName', header: this.translate.instant('laborDay.professionId'), sortField: 'inm/QProfession.profession.name', width: '15rem'},
      {field: 'startDate', header: this.translate.instant('inmateLabor.list.startDate'), sortField: 'startDate', width: '8rem', align: 'center'},
      {field: 'actualEndDate', header: this.translate.instant('inmateLabor.list.actualEndDate'), sortField: 'actualEndDate', width: '8rem', align: 'center'},
      {field: 'pLocationDescription', header: this.translate.instant('inmateLabor.locationPid'), sortField: '', width: '10rem'},
      {field: 'areaFullDescription', header: this.translate.instant('inmateLabor.areaId'), sortField: '', width: '25rem'}
    ];
  }

  initializePaging() {
    return {
      first: this.toitsuTableService.FIRST,
      rows: this.toitsuTableService.ROWS,
      sortField: 'startDate',
      sortOrder: -1
    };
  }

  initializeArgs() {
    return {
      inmateId: this.model.inmate.id,
      inmateLaborCategory: null,
      professionId: null,
      startDateAfter: null,
      startDateBefore: null,
      actualEndDateAfter: null,
      actualEndDateBefore: null
    };
  }

  initializeExportModel() {
    return new ExportModel(this.translate.instant('inm.laborCatalog.inmateLabors') + ' - ' + this.model.inmate.fullName,
      'laborCatalogController', 'catalogInmateLaborIndex', 'inm.args.LaborCatalogInmateLaborArgs');
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }


}
