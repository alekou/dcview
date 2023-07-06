import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {hearingApplicationConsts} from './hearing-application.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-hearing-application-list',
  templateUrl: 'hearing-application-list.component.html'
})
export class HearingApplicationListComponent implements OnInit{
  subsystem: string;
  viewLink: string;
  url = hearingApplicationConsts.indexUrl;
  inmatesUrl = inmateConsts.lastRecordIndexUrl;
  pReceivers = {};
  yesNoEnums = [];
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'serialNumber', header: this.translate.instant('hearingApplication.sn'), sortField: 'serialNumber', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('hearingApplication.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'receiver', header: this.translate.instant('hearingApplication.receiverPid'), sortField: 'cm/QGenParameter.receiver.description', width: '10rem'},
    {field: 'emergencyLabel', header: this.translate.instant('hearingApplication.emergency'), sortField: 'emergency', width: '6rem', align: 'center'},
    {field: 'applicationDate', header: this.translate.instant('hearingApplication.applicationDate'), sortField: 'applicationDate', width: '8rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('hearingApplication.comments'), sortField: 'comments', width: '15rem'}
  ];

  exportModel = new ExportModel(this.translate.instant('med.hearingApplication'), 'hearingApplicationController', 'hearingApplicationIndex', 'med.args.HearingApplicationArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'serialNumber',
    sortOrder: -1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(private translate: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private genParameterTypeService: GenParameterTypeService,
              private enumService: EnumService) 
  {
    this.subsystem = this.activatedRoute.snapshot.pathFromRoot[1].routeConfig.path;
    this.viewLink = '/' + this.subsystem + '/hearingapplication/view';
  }

  ngOnInit(): void {
    let category = null;
    
    if (this.subsystem === 'inm' ) {
      category = GenParameterCategory.HearingApplication_InmReceiver;
    }
    else {
      category = GenParameterCategory.HearingApplication_MedReceiver;
    } 
    
    // Παραλήπτες
    this.genParameterTypeService.getByCategory(category, []).subscribe((responseData: GenParameterType) => {
      this.pReceivers = responseData;
    });

    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      receiverPid: null,
      applicationDateAfter: null,
      applicationDateBefore: null,
      emergency: null,
      hearingTypeKind: this.activatedRoute.snapshot.pathFromRoot[1].routeConfig.path.toUpperCase()
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
