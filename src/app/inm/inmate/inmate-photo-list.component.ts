import {Component, OnInit, ViewChild} from '@angular/core';
import {areaConsts} from '../area/area.consts';
import {inmatePhotoConsts} from '../inmate-photo/inmate-photo.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {EnumService} from '../../cm/enum/enum.service';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Country} from '../../sa/country/country.model';
import {CountryService} from '../../sa/country/country.service';

@Component({
  selector: 'app-inmate-photo-list',
  templateUrl: 'inmate-photo-list.component.html'
})
export class InmatePhotoListComponent implements OnInit {

  url = inmatePhotoConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'inmateExtraActions1', width: '5rem', align: 'center', customCell: 'cell1'},
    {field: 'inmateExtraActions2', width: '3rem', align: 'center', customCell: 'cell2'},
    {field: 'inmateFullName', header: this.translate.instant('inmatePhoto.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'inmatePhotoThumbnail', header: this.translate.instant('inmatePhoto.showPhotoHeader'), width: '25rem', customCell: 'cell3', align: 'center'},
    {field: 'currentLabel', header: this.translate.instant('inmatePhoto.current'), width: '7rem', align: 'center'},
    {field: 'photoDate', header: this.translate.instant('inmatePhoto.photoDate'), sortField: 'photoDate', width: '10rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('inmatePhoto.comments'), sortField: 'comments', width: '10rem'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'inm/QInmate.inmate.lastName',
    sortOrder: 1
  };

  scrollHeight = '55rem';

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  viewLink = '/inm/inmate/view';
  folderLink = '/inm/inmate/folder';

  @ViewChild('table') table: ToitsuTableComponent;

  nationalities = [];
  inmateRecordStatuses = [];
  yesNoEnums = [];
  inmateRecordCategories = [];


  constructor(
    private translate: TranslateService,
    private enumService: EnumService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private countryService: CountryService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Φόρτωση λίστας υπηκοοτήτων
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.nationalities = responseData;
    });

    // Φόρτωση λίστας καταστάσεων κράτησης
    this.enumService.getEnumValues('inm.core.enums.option.InmateStatusOption').subscribe(responseData => {
      this.inmateRecordStatuses = responseData;
    });

    // Φόρτωση λίστας υπηκοοτήτων Ναι/Όχι
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });

    // Φόρτωση λίστας κατηγοριών κράτησης
    this.enumService.getEnumValues('inm.core.enums.option.InmateRecordCategoryOption').subscribe(responseData => {
      this.inmateRecordCategories = responseData;
    });

    // Αρχικοποίηση συγκεκριμένων πεδίων στα args
    this.args.currentInmatePhoto = 'YES';

  }

  initializeArgs() {
    return {
      currentInmatePhoto: 'YES',
      masterInmateCode: null,
      inmateCode: null,
      masterInmateDee: null,
      inmateLastName: null,
      inmateFirstName: null,
      inmateFatherName: null,
      inmateMotherName: null,
      inmateNationalityId: null,
      inmateRecordStatus: null,
      folderPossession: null,
      inmateRecordCategory: null,
      inmateRecordElectroActive: null
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

  toInmateList() {
    this.router.navigate(['/inm/inmate/list']);
  }

}
