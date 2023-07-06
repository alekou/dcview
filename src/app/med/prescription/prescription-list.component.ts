import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {EnumService} from '../../cm/enum/enum.service';
import {prescriptionConsts} from './prescription.consts';

@Component({
  selector: 'app-med-prescription-list',
  templateUrl: 'prescription-list.component.html'
})
export class PrescriptionListComponent implements OnInit {

  url = prescriptionConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'prescriptionDate', header: this.translate.instant('prescription.prescriptionDate'), sortField: 'prescriptionDate', width: '15rem', align: 'center'},
    {field: 'description', header: this.translate.instant('prescription.description'), sortField: 'description', width: '20rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('prescription.inmateId'), sortField: 'inmateFullName', width: '15rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('prescription.doctorId'), sortField: 'doctorFullName', width: '10rem', align: 'center'},
    {field: 'prescriptionStatus', header: this.translate.instant('prescription.isExecuted'), sortField: 'isExecuted', width: '15rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'prescriptionDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.prescription'), 'prescriptionController', 'prescriptionIndex', 'med.args.PrescriptionArgs');
  viewLink = '/med/prescription/view';

  @ViewChild('table') table: ToitsuTableComponent;
  inmateDialogUrl: string;
  allDoctors = [];
  medicineTypes = [];

  constructor(
    private doctorService: DoctorService,
    private translate: TranslateService,
    private router: Router,
    private enumService: EnumService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {

    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    // Active Doctors
    this.doctorService.getAllDoctors().subscribe(allDoctors => {
      this.allDoctors = allDoctors;
    });

    this.enumService.getEnumValues('med.core.enums.option.MedicineTypeOption').subscribe(responseData => {
      this.medicineTypes = responseData;
    });
  }

  initializeArgs() {
    return {
      dateFrom: null,
      dateTo: null,
      inmateId: null,
      doctorId: null,
      medicineTypeOption: null
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
