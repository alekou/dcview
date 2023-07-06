import {Component, ElementRef, OnInit, Optional, Renderer2, SkipSelf, ViewChild} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {courthouseConsts} from '../courthouse.consts';
import {GenParameterService} from '../../gen-parameter/gen-parameter.service';
import {GenParameterCategory} from '../../gen-parameter/gen-parameter.category';
import {CityService} from '../../city/city.service';

@Component({
  selector: 'app-sa-courthouse-list-dialog',
  templateUrl: 'courthouse-list-dialog.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class CourthouseListDialogComponent extends DefaultValueAccessor implements OnInit {

  url = courthouseConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'name', header: this.translate.instant('courthouse.name'), sortField: 'name', width: '15rem'},
    {field: 'category', header: this.translate.instant('courthouse.categoryPid'), sortField: 'category.description', width: '12rem', align: 'center'},
    {field: 'kind', header: this.translate.instant('courthouse.kindPid'), sortField: 'kind.description', width: '12rem', align: 'center'},
    {field: 'type', header: this.translate.instant('courthouse.typePid'), sortField: 'type.description', width: '12rem', align: 'center'},
    {field: 'cityName', header: this.translate.instant('courthouse.cityId'), sortField: 'city.nameGreek', width: '12rem', align: 'center'},
  ];

  sortField = 'name';
  sortOrder = 1;
  args = this.initializeArgs();

  @ViewChild('table') table;
  selectedRowData: any;
  categories = [];
  kinds = [];
  cities = [];

  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private enumService: EnumService,
    private toitsuToasterService: ToitsuToasterService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private genParameterService: GenParameterService,
    private cityService: CityService

  ) {super(renderer, elementRef, true); }

  ngOnInit() {
    // Categories
    this.genParameterService.getByCategory(GenParameterCategory.Courthouse_Category, true, []).subscribe(responseData => {
      this.categories = responseData;
    });

    // Kinds
    this.genParameterService.getByCategory(GenParameterCategory.Courthouse_Kind, true, []).subscribe(responseData => {
      this.kinds = responseData;
    });

    // Cities
    this.cityService.getGreekCities(true, []).subscribe({
      next: (responseData) => {this.cities = responseData;
      }
    });
  }

  initializeArgs() {
    return {
      name: null,
      categoryPid: null,
      kindPid: null,
      cityId: null,
      isActive: 'YES'
    };
  }
  rowDblClicked(rowData) {
    let id = rowData['id'];
    this.dynamicDialogRef.close(id);
  }
  rowSelected(rowData) {
    this.selectedRowData = rowData['data'];
  }
  rowUnselected(rowData) {
    this.selectedRowData = null;
  }
  loadTableData() {
    this.table.loadTableData();
  }
  clearArgs() {
    this.args = this.initializeArgs();
  }
  confirm() {
    if (!this.selectedRowData) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.selectedRowData['id']);
    }
  }
  cancel() {
    this.dynamicDialogRef.close();
  }
}
