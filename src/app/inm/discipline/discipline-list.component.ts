import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {disciplineConsts} from './discipline.consts';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {DisciplineService} from './discipline.service';
import {InmateService} from '../inmate/inmate.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-discipline-list',
  templateUrl: 'discipline-list.component.html'
})
export class DisciplineListComponent implements OnInit {

  url = disciplineConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('discipline.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'decisionAuthority', header: this.translate.instant('discipline.decisionAuthorityPid'), sortField: 'cm/QGenParameter.decisionAuthority.description', width: '15rem'},
    {field: 'decisionDate', header: this.translate.instant('discipline.decisionDate'), sortField: 'decisionDate', width: '10rem', align: 'center'},
    {field: 'endDate', header: this.translate.instant('discipline.endDate'), sortField: 'endDate', width: '10rem', align: 'center'},
    {field: 'decisionNo', header: this.translate.instant('discipline.decisionNo'), sortField: 'decisionNo', width: '10rem'},
    {field: 'reason', header: this.translate.instant('discipline.reason'), sortField: 'reason', width: '15rem'},
    {field: 'disciplineType', header: this.translate.instant('discipline.disciplineTypePid'), sortField: 'cm/QGenParameter.offenseType.description', width: '15rem'
    },
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'inm/QInmate.inmate.lastName',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.discipline'), 'disciplineController', 'disciplineIndex', 'inm.args.DisciplineArgs');

  viewLink = '/inm/discipline/view';
  massCreateLink = '/inm/discipline/masscreate';


  @ViewChild('table') table: ToitsuTableComponent;

  inmates = [];
  disciplineTypeParams = {};
  disciplineBehaviorParams = {};
  disciplineDecisionAuthorityParams = {};
  yesNoEnums = [];
  inmateDialogUrl: string;


  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private disciplineService: DisciplineService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private inmateService: InmateService,
    private enumService: EnumService
  ) {
  }

  ngOnInit(): void {

    // Discipline Behaviors
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_Behavior,  []).subscribe(responseData => {
      this.disciplineBehaviorParams = responseData;
    });

    // Discipline Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_Type, []).subscribe(responseData => {
      this.disciplineTypeParams = responseData;
    });

    // Discipline Decision Authorities
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_DecisionAuthority,  []).subscribe(responseData => {
      this.disciplineDecisionAuthorityParams = responseData;
    });

    // Inmates
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    // Enum Values
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      decisionDateAfter: null,
      decisionDateBefore: null,
      behaviorPid: null,
      disciplineTypePid: null,
      decisionAuthorityPid: null,
      inmateCode: null,
      merged: null
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
