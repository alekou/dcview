import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {doctorConsts} from './doctor.consts';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-doctor-list',
  templateUrl: 'doctor-list.component.html'
})
export class DoctorListComponent implements OnInit {

  url = doctorConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '7rem', align: 'center'},
    {field: 'fullName', header: this.translate.instant('doctor.fullName'), sortField: 'fullName', width: '25rem', align: 'center'},
    {field: 'phone', header: this.translate.instant('doctor.phone'), sortField: 'phone', width: '15rem', align: 'center'},
    {field: 'specialty', header: this.translate.instant('doctor.specialtyPid'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '20rem', align: 'center'},
    {field: 'isActiveLabel', header: this.translate.instant('doctor.isActive'), sortField: 'isActive', width: '10rem', align: 'center'},
    {field: 'isExpertOption', header: this.translate.instant('doctor.isExpert'), sortField: 'isExpert', width: '10rem', align: 'center'},
    {field: 'isExternalOption', header: this.translate.instant('doctor.isExternal'), sortField: 'isExternal', width: '10rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'phone',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('sa.doctor'), 'doctorController', 'doctorIndex', 'med.args.DoctorArgs');
  viewLink = '/sa/doctor/view';

  @ViewChild('table') table: ToitsuTableComponent;
  pSpecialty = {};
  yesNoEnums = [];
  doctorTypes = [];
  
  constructor(
    private translate: TranslateService,
    private enumService: EnumService,
    private router: Router,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {

    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });

    // doctorTypes
    this.enumService.getEnumValues('med.core.enums.DoctorType').subscribe(responseData => {
      this.doctorTypes = responseData;
    });

    // specialties
    this.genParameterTypeService.getByCategory(GenParameterCategory.HearingApplication_MedReceiver, []).subscribe(responseData => {
      this.pSpecialty = responseData;
    });
  }

  initializeArgs() {
    return {
      specialty: null,
      doctorType: null,
      isActive: null,
      isExpert: null,
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
