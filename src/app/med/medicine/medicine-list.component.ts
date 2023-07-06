import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {medicineConsts} from './medicine.consts';
import {MedicineCategoryService} from '../medicine-category/medicine-category.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-medicine-list',
  templateUrl: 'medicine-list.component.html'
})
export class MedicineListComponent implements OnInit {

  url = medicineConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'eofCode', header: this.translate.instant('medicine.eofCode'), sortField: 'eofCode', width: '15rem', align: 'center'},
    {field: 'medicineName', header: this.translate.instant('medicine.medicineName'), sortField: 'medicineName', width: '20rem', align: 'center'},
    {field: 'shape', header: this.translate.instant('medicine.shape'), sortField: 'shape', width: '20rem', align: 'center'},
    {field: 'substancesDescription', header: this.translate.instant('medicine.substancesPid'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '15rem', align: 'center'},
    {field: 'categoryDescription', header: this.translate.instant('medicine.categoryId'), sortField: 'med/QMedicineCategory.medicineCategory.description', width: '10rem', align: 'center'},
    {field: 'subCategoryDescription', header: this.translate.instant('medicine.subCategoryId'), sortField: 'med/QMedicineCategory.medicineCategory.description', width: '15rem', align: 'center'},
    {field: 'content', header: this.translate.instant('medicine.content'), sortField: 'content', width: '15rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'eofCode',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.medicine'), 'medicineController', 'medicineIndex', 'med.args.MedicineArgs');
  viewLink = '/med/medicine/view';

  @ViewChild('table') table: ToitsuTableComponent;
  categories = [];
  subCategories = [];
  pSubstance = {};
  yesNoEnums = [];

  constructor(
    private medicineCategoryService: MedicineCategoryService,
    private translate: TranslateService,
    private router: Router,
    private enumService: EnumService,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    
    this.medicineCategoryService.getAllMedicineCategories('CATEGORY').subscribe(categories => {
      this.categories = categories;
    });
    this.medicineCategoryService.getAllMedicineCategories('SUBCATEGORY').subscribe(subCategories => {
      this.subCategories = subCategories;
    });

    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Medicine_Substances, []).subscribe(responseData => {
      this.pSubstance = responseData;
    });
  }

  initializeArgs() {
    return {
      medicineName: null,
      categoryId: null,
      subCategoryId: null,
      substancesPid: null,
      isGeneric: null,
      eofCodeBefore: null,
      eofCodeAfter: null,
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
