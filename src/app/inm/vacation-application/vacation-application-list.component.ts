import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {vacationApplicationConsts} from './vacation-application.consts';
import {VacationApplicationService} from './vacation-application.service';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-inm-vacation-application-list',
  templateUrl: 'vacation-application-list.component.html'
})
export class VacationApplicationListComponent implements OnInit {
  id: number;
  url = vacationApplicationConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'customExtraActions', width: '4%', align: 'center', customCell: 'cell1'},
    {field: 'protocolNo', header: this.translate.instant('vacationApplication.protocolNo'), sortField: 'protocolNo', width: '7rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('vacationApplication.inmateFullName'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'vacationTypeDescription', header: this.translate.instant('vacationApplication.vacationTypeId'), sortField: 'inm/QVacationType.vacationType.description', width: '10rem', align: 'center'},
    {field: 'applicationDate', header: this.translate.instant('vacationApplication.applicationDate'), sortField: 'applicationDate', width: '10rem', align: 'center'},
    {field: 'destination', header: this.translate.instant('vacationApplication.destination'), sortField: 'destination', width: '10rem', align: 'center'},
    {field: 'reason', header: this.translate.instant('vacationApplication.reason'), sortField: 'reason', width: '10rem', align: 'center'},
    {field: 'applicationStatusLabel', header: this.translate.instant('vacationApplication.applicationStatus'), sortField: 'applicationStatus', width: '15rem', align: 'center'},
    {field: 'approvalStatusLabel', header: this.translate.instant('vacation.approvalStatus'), sortField: 'approvalStatus', width: '15rem', align: 'center'},
  ];

  inmateDialogUrl: string;
  vacationTypes = [];
  applicationStatuses = [];
  approvalStatuses = [];
  @ViewChild(NgForm) vacationApplicationForm: NgForm;
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'applicationDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('inm.vacationApplication'), 'vacationApplicationController', 'vacationApplicationIndex', 'inm.args.VacationApplicationArgs');
  viewLink = '/inm/vacationapplication/view';

  @ViewChild('table') table: ToitsuTableComponent;
  constructor(
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuTableService: ToitsuTableService,
    private vacationApplicationService: VacationApplicationService,
    private vacationTypeService: VacationTypeService,
    private enumService: EnumService,
  ) {}

  initializeArgs() {
    return {
      inmateCode: null,
      inmateLastName: null,
      inmateFirstName: null,
      protocolNo: null,
      applicationDateAfter: null,
      applicationDateBefore: null,
      applicationStatus: null,
      approvalStatus: null,
      origin: 'APPLICATION'
    };
  }

  ngOnInit(): void {
    
    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });
    
    this.enumService.getEnumValues('inm.core.enums.VacationApplicationStatus').subscribe(responseDate => {
      this.applicationStatuses = responseDate;
    });
    
    this.enumService.getEnumValues('inm.core.enums.VacationApprovalStatus').subscribe(responseData => {
      this.approvalStatuses = responseData;
    });
    
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  }


  applicationStatusChanged(motionId) {
    this.confirmationService.confirm({
      message: this.translate.instant('vacationApplication.changeApplicationStatus.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        let motionData = {
          id: motionId,
          applicationStatus: 'MOTION_PROGRESS'
        };

        this.vacationApplicationService.saveVacationMotion(motionData).subscribe({

          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay();
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.router.navigate(['/inm/vacationapplication/motion/view', motionId]);
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
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
