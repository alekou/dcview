import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AreaService} from '../../area/area.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {inmateLaborApplicationConsts} from '../inmate-labor-application.consts';
import {ToitsuTableComponent} from '../../../toitsu-shared/toitsu-table/toitsu-table.component';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-inm-inmate-labor-application-list-dialog',
  templateUrl: 'inmate-labor-application-list-dialog.component.html'
})
export class InmateLaborApplicationListDialogComponent implements OnInit {

  selectedAreaId: number = null;
  selectedInmateLaborApplications = [];

  areas = [];

  url = inmateLaborApplicationConsts.protocolIndexUrl;

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('inmateLaborApplication.protocolNo'), sortField: 'protocolNo', width: '10rem'},
    {field: 'inmateFullName', header: this.translate.instant('inmateLaborApplication.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'protocolDate', header: this.translate.instant('inmateLaborApplication.requestDate'), sortField: 'protocolDate', width: '10rem', align: 'center'},
    {field: 'requestedProfessionName', header: this.translate.instant('inmateLaborApplication.requestedProfession'), sortField: 'inm/QProfession.profession.name', width: '20rem'}
  ];

  sortField = 'protocolDate';
  sortOrder = -1;

  args = this.initializeArgs();

  selectionMode = 'multiple';

  scrollHeight = '25rem';

  @ViewChild('table') table: ToitsuTableComponent;

  loading: boolean = false;

  constructor(
    private areaService: AreaService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private http: HttpClient
  ) {
    // Αρχικοποίηση δεδομένων
    this.selectedAreaId = this.dynamicDialogConfig.data.selectedAreaId;
  }

  ngOnInit(): void {

    // Φόρτωση λίστας περιοχών
    this.areaService.getAreasWithoutPositions().subscribe(responseData => {
      this.areas = responseData;
    });

    // Αρχικοποίηση της επιλεγμένης περιοχής
    if (this.selectedAreaId) {
      this.args.areaId = this.selectedAreaId;
    }

  }

  initializeArgs() {
    return {
      requestDateAfter: null,
      requestDateBefore: null,
      areaId: null
    };
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
  }

  addAll() {
    this.loading = true;
    this.initializeArgs();
    this.table.clearSelectedItems();

    let totalElements;

    let theFirst = 0;
    let theRows = 5000;
    let theSortField = this.sortField;
    let theSortOrder = this.sortOrder;

    const page = String(theFirst / theRows + 1);
    const rows = String(theRows);
    const sidx = theSortField ? theSortField : 'id';
    const sord = theSortOrder === 1 ? 'asc' : 'desc';

    let pageParams = new HttpParams();
    pageParams = pageParams.append('page', page);
    pageParams = pageParams.append('rows', rows);
    pageParams = pageParams.append('sidx', sidx);
    pageParams = pageParams.append('sord', sord);

    this.http
      .post<PageModel>(
        environment.apiBaseUrl + this.url,
        this.args,
        {
          params: pageParams
        }
      )
      .subscribe({
        next: (responseData) => {
          this.selectedInmateLaborApplications = responseData.content;
          totalElements = responseData.totalElements;
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        // Επιστροφή όλων των αιτημάτων εργασίας από τον πίνακα και κλείσιμο του dialog
        if (this.selectedInmateLaborApplications.length > 0) {
          this.dynamicDialogRef.close(this.selectedInmateLaborApplications);
          this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.addAll.success') + `<br>`
            + ` (` + totalElements + ' ' + this.translate.instant('placementProtocol.inmateLaborApplications.view') + `)`);
        } else {
          this.dynamicDialogRef.close(this.selectedInmateLaborApplications);
          this.toitsuToasterService.showErrorStay(this.translate.instant('inmateLaborApplication.addAll.error'));
        }
        this.loading = false;
      });
  }

  addSelected() {
    // Επιστροφή των επιλεγμένων αιτημάτων εργασίας και κλείσιμο του dialog
    this.selectedInmateLaborApplications = this.table.selectedItems;
    if (this.selectedInmateLaborApplications.length > 0) {
      this.dynamicDialogRef.close(this.selectedInmateLaborApplications);
      this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.addSelected.success'));
    } else if (this.selectedInmateLaborApplications.length === 0 && this.table.data.length > 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('inmateLaborApplication.addSelected.error'));
    } else if (this.selectedInmateLaborApplications.length === 0 && this.table.data.length === 0) {
      this.dynamicDialogRef.close(this.selectedInmateLaborApplications);
      this.toitsuToasterService.showErrorStay(this.translate.instant('inmateLaborApplication.addAll.error'));
    }
  }

  cancel() {
    this.dynamicDialogRef.close();
  }

}


class PageModel {
  content: any[];
  totalElements: number;
}
