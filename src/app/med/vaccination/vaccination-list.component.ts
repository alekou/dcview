import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {vaccinationConsts} from './vaccination.consts';
import {inmateConsts} from '../../inm/inmate/inmate.consts';

@Component({
  selector: 'app-med-vaccination-list',
  templateUrl: 'vaccination-list.component.html'
})
export class VaccinationListComponent implements OnInit {
  
  url = vaccinationConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('vaccination.inmate'), sortField: 'inmateFullName', width: '25rem'},
    {field: 'vaccineDescription', header: this.translate.instant('vaccination.vaccineDescription'), sortField: 'med/QVaccine.vaccine.description', width: '25rem'},
    {field: 'currentDose', header: this.translate.instant('vaccination.currentDose'), sortField: 'currentDose', width: '10rem', align: 'center'},
    {field: 'scheduledDate', header: this.translate.instant('vaccination.scheduledDate'), sortField: 'scheduledDate', width: '10rem', align: 'center'},
    {field: 'status', header: this.translate.instant('vaccination.vaccinationStatus'), sortField: 'vaccinationStatus', width: '10rem', align: 'center'},
    {field: 'vaccinationDate', header: this.translate.instant('vaccination.vaccinationDate'), sortField: 'vaccinationDate', width: '10rem', align: 'center'},
    {field: 'cancelReason', header: this.translate.instant('vaccination.cancelReason'), sortField: 'cancelReason', width: '30rem'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'currentDose',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.vaccination'), 'vaccinationController', 'vaccinationIndex', 'med.args.VaccinationArgs');
  viewLink = '/med/vaccination/view';

  @ViewChild('table') table: ToitsuTableComponent;
  inmateDialogUrl: string;
  vaccinationStatuses = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService) {}

  ngOnInit() {
    
    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    this.enumService.getEnumValues('med.core.enums.VaccinationStatus').subscribe(responseData => {
      this.vaccinationStatuses = responseData;
    });
    
  }

  initializeArgs() {
    return {
      inmateId: null,
      vaccineDescription: null,
      fromScheduledDate: null,
      toScheduledDate: null,
      fromVaccinationDate: null,
      toVaccinationDate: null,
      vaccinationStatus: null
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
