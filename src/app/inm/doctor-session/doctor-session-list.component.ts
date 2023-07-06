import {Component, OnInit, ViewChild} from '@angular/core';
import {inmateConsts} from '../inmate/inmate.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {doctorSessionConsts} from './doctor-session.consts';
import {SessionTypeService} from '../../sa/session-type/session-type.service';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {DoctorSessionService} from './doctor-session.service';

@Component({
  standalone: true,
  selector: 'app-inm-doctor-session-list',
  imports: [ToitsuSharedModule, GeneralSharedModule],
  templateUrl: 'doctor-session-list.component.html'
})
export class DoctorSessionListComponent implements OnInit {
  subsystem: string;
  doctorType: string;
  viewLink: string;
  url = doctorSessionConsts.indexUrl;
  inmatesUrl = inmateConsts.lastRecordIndexUrl;
  sessionTypes = [];


  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('doctorSession.inmateId'), sortField: 'inmateFullName', width: '25rem'},
    {field: 'sessionTypeDescription', header: this.translate.instant('doctorSession.sessionTypeId'), sortField: 'sessionType', width: '8rem', align: 'center'},
    {field: 'sessionDate', header: this.translate.instant('doctorSession.sessionDate'), sortField: 'sessionDate', width: '10rem', align: 'center'},
    {field: 'description', header: this.translate.instant('doctorSession.description'), sortField: 'description', width: '20rem'}
  ];

  

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'sessionDate',
    sortOrder: -1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;



  constructor(
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toitsuTableService: ToitsuTableService,
    private sessionTypeService: SessionTypeService,
    private doctorSessionService: DoctorSessionService) 
  {
    this.subsystem = this.activatedRoute.snapshot.pathFromRoot[1].routeConfig.path;
    this.doctorType = this.activatedRoute.snapshot.pathFromRoot[4].routeConfig.path;
    this.viewLink = '/' + this.subsystem + '/doctorsession/' + this.doctorType + '/view';
    this.exportModel = new ExportModel(this.translate.instant('inm.doctorSession' + '.' + this.doctorType), 'doctorSessionController', 'doctorSessionIndex', 'inm.args.DoctorSessionArgs');
  }
  exportModel: ExportModel;
  ngOnInit(): void {
    this.doctorSessionService.authorizeDoctor(this.doctorType.toUpperCase()).subscribe(
      hasPermission => {
        if (!hasPermission) {
          this.router.navigate(['/403']); // Redirect to the 403 page
        }
      }
    );
    this.getSessionTypes(this.doctorType.toUpperCase());
    
    this.clearArgs();
  }

  initializeArgs() {
    return {
      doctorType: this.activatedRoute.snapshot.pathFromRoot[4].routeConfig.path.toUpperCase(),
      inmateId: null,
      inmateCode: null,
      sessionTypeId: null,
      sessionDateAfter: null,
      sessionDateBefore: null
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
    this.router.navigate(['/' + this.subsystem + '/doctorsession/' + this.doctorType + '/view']);
  }

  private getSessionTypes(doctorType) {
    this.sessionTypeService.getSessionTypesByDoctorType(doctorType).subscribe({
      next: (responseData) => {
        this.sessionTypes = responseData;
      }
    });

  }
}
