import {Component, OnInit, ViewChild} from '@angular/core';
import {inmateLaborApplicationConsts} from './inmate-labor-application.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-inmate-labor-application-list',
  templateUrl: 'inmate-labor-application-list.component.html'
})
export class InmateLaborApplicationListComponent implements OnInit {

  inmateDialogUrl: string;

  employmentOptions = [];
  requestStatusOptions = [];

  url = inmateLaborApplicationConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('inmateLaborApplication.protocolNo'), sortField: 'protocolNo', width: '10rem'},
    {field: 'inmateFullName', header: this.translate.instant('inmateLaborApplication.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'protocolDate', header: this.translate.instant('inmateLaborApplication.requestDate'), sortField: 'protocolDate', width: '10rem', align: 'center'},
    {field: 'requestedProfessionName', header: this.translate.instant('inmateLaborApplication.requestedProfession'), sortField: 'inm/QProfession.profession.name', width: '20rem'},
    {field: 'rejectedLabel', header: this.translate.instant('inmateLaborApplication.rejected'), width: '10rem', align: 'center'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'inm/QInmate.inmate.lastName',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.inmateLaborApplication'), 'inmateLaborApplicationController', 'inmateLaborApplicationIndex', 'inm.args.InmateLaborApplicationArgs');

  viewLink = '/inm/inmatelaborapplication/view';
  massCreateLink = '/inm/inmatelaborapplication/masscreate';

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private enumService: EnumService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private translate: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Φόρτωση λίστας κρατουμένων
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    // Φόρτωση λίστας συνδέσεων αίτησης με εργασία
    this.enumService.getEnumValues('inm.core.enums.option.InmateLaborApplicationEmploymentOption').subscribe(responseData => {
      this.employmentOptions = responseData;
    });

    // Φόρτωση λίστας καταστάσεων αίτησης
    this.enumService.getEnumValues('inm.core.enums.option.InmateLaborApplicationStatusOption').subscribe(responseData => {
      this.requestStatusOptions = responseData;
    });

    // Αρχικοποίηση συγκεκριμένων πεδίων στα args
    this.args.status = 'PENDING_REJECTED';
  }

  initializeArgs() {
    return {
      inmateId: null,
      masterInmateCode: null,
      protocolNo: null,
      requestDateAfter: null,
      requestDateBefore: null,
      employment: null,
      status: 'PENDING_REJECTED'
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

  goToMassCreate() {
    this.router.navigate([this.massCreateLink]);
  }

}
