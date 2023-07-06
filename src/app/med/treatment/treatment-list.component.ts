import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {treatmentConsts} from './treatment.consts';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {EnumService} from '../../cm/enum/enum.service';
import {MedicineService} from '../medicine/medicine.service';

@Component({
  selector: 'app-med-treatment-list',
  templateUrl: 'treatment-list.component.html'
})
export class TreatmentListComponent implements OnInit {

  url = treatmentConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'treatmentDate', header: this.translate.instant('treatment.treatmentDate'), sortField: 'treatmentDate', width: '15rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('treatment.inmateId'), sortField: 'inmateFullName', width: '20rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('treatment.doctorId'), sortField: 'doctorFullName', width: '15rem', align: 'center'},
    {field: 'treatmentStatus', header: this.translate.instant('treatment.active'), sortField: 'stop', width: '10rem', align: 'center'},
    {field: 'fromDate', header: this.translate.instant('treatment.fromDate'), width: '15rem', align: 'center'},
    {field: 'toDate', header: this.translate.instant('treatment.toDate'), width: '15rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'treatmentDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.treatment'), 'treatmentController', 'treatmentIndex', 'med.args.TreatmentArgs');
  viewLink = '/med/treatment/view';

  @ViewChild('table') table: ToitsuTableComponent;
  medicineType = 'ALL';
  inmateDialogUrl: string;
  allDoctors = [];
  treatmentsStatuses = [];
  medicineTypes = [];
  medicines = [];

  constructor(
    private medicineService: MedicineService,
    private doctorService: DoctorService,
    private translate: TranslateService,
    private router: Router,
    private enumService: EnumService,
    private genParameterService: GenParameterService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {

    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    // Active Doctors
    this.doctorService.getAllTreatmentDoctors().subscribe(allDoctors => {
      this.allDoctors = allDoctors;
    });
    
    this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(responseData => {
      this.medicines = responseData;
    });

    this.enumService.getEnumValues('med.core.enums.option.TreatmentStatusOption').subscribe(responseData => {
      this.treatmentsStatuses = responseData;
    });

    this.enumService.getEnumValues('med.core.enums.option.MedicineTypeOption').subscribe(responseData => {
      this.medicineTypes = responseData;
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      doctorId: null,
      fromDate: null,
      toDate: null,
      treatmentStatusOption: null,
      medicineTypeOption: null,
      medicineId: null,
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

  medicineTypeChanged() {
   if (this.args.medicineTypeOption) {
     this.medicineType = this.args.medicineTypeOption;
     this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(responseData => {
       this.medicines = responseData;
     });
   }
   else {
     this.medicineType = 'ALL';
     this.medicineService.getAllMedicinesByType(this.medicineType).subscribe(responseData => {
       this.medicines = responseData;
     }); 
   }
  }
}
