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

@Component({
  selector: 'app-inm-labor-catalog-calendar-list',
  templateUrl: 'labor-catalog-calendar-list.component.html'
})
export class LaborCatalogCalendarListComponent implements OnInit {

  @Input() model: LaborCatalog = null;

  url = laborCatalogConsts.catalogCalendarIndexUrl;

  cols: any[] = null;
  paging = null;
  args = null;

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private translate: TranslateService,
    private toitsuTableService: ToitsuTableService,
  ) {
  }

  ngOnInit(): void {
    // Αρχικοποίηση μεταβλητών βάσει του επιλεγμένου κρατουμένου
    if (this.model != null) {
      this.cols = this.initializeCols();
      this.paging = this.initializePaging();
      this.args = this.initializeArgs();
    }
  }

  initializeCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'thisDate', header: this.translate.instant('laborCatalog.calendar.thisDate'), sortField: 'thisDate', width: '8rem', align: 'center'},
      {field: 'inDetentionCenterLabel', header: this.translate.instant('laborCatalog.calendar.inDetentionCenter'), width: '10rem', align: 'center'},
      {field: 'periodAbsence', header: this.translate.instant('laborCatalog.calendar.periodAbsence'), width: '8rem'},
      {field: 'professionName', header: this.translate.instant('laborDay.professionId'), width: '15rem'},
      {field: 'laborDayLabel', header: this.translate.instant('laborCatalog.calendar.laborDay'), width: '10rem', align: 'center'},
      {field: 'specialProfessionName', header: this.translate.instant('laborCatalog.calendar.specialLabor'), width: '10rem', align: 'center'},
      {field: 'specialLaborDayLabel', header: this.translate.instant('laborCatalog.calendar.specialLaborDay'), width: '10rem', align: 'center'}
    ];
  }

  initializePaging() {
    return {
      first: this.toitsuTableService.FIRST,
      rows: this.toitsuTableService.ROWS,
      sortField: 'thisDate',
      sortOrder: -1
    };
  }

  initializeArgs() {
    return {
      inmateId: this.model.inmate.id,
      dateAfter: null,
      dateBefore: null
    };
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
  }

}
