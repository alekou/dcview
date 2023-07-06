import {Component, OnInit, ViewChild} from '@angular/core';
import {inmateAreaConsts} from './inmate-area.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {InmateAreaService} from './inmate-area.service';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {ExportModel} from '../../cm/export/export.model';
import {Router} from '@angular/router';
import {AreaService} from '../area/area.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {CountryService} from '../../sa/country/country.service';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {InmatePhotoService} from '../inmate-photo/inmate-photo.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';


@Component({
  selector: 'app-inmate-area-catalog',
  templateUrl: './inmate-area-catalog.component.html',
  styleUrls: ['./inmate-area.css']
})

export class InmateAreaCatalogComponent implements OnInit {

  inmateDialogUrl: string;

  areas = [];
  nationalities = [];
  pCharacterizations: {} = [];
  pDurations: {} = [];
  pJudgmentFacts: {} = [];
  inmateAreaStatuses = [];

  url = inmateAreaConsts.catalogIndexUrl;

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'inm/QInmate.inmate.lastName',
    sortOrder: 1
  };

  args = this.initializeArgs();

  cols = this.initializeTableCols();

  exportModel = new ExportModel(this.translate.instant('inm.subgroup.inmateArea.catalog'), 'inmateAreaController', 'inmateAreaCatalogIndex', 'inm.args.InmateAreaCatalogArgs');

  @ViewChild('table') table: ToitsuTableComponent;
  selectedInmateAreaRecord = null;



  constructor(
    private inmateAreaService: InmateAreaService,
    public inmatePhotoService: InmatePhotoService,
    private areaService: AreaService,
    private genParameterTypeService: GenParameterTypeService,
    private countryService: CountryService,
    private enumService: EnumService,
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Φόρτωση λίστας κρατουμένων
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    // Φόρτωση λίστας περιοχών
    this.areaService.getAllAreas(this.authService.getUserDcId()).subscribe(responseData => {
      this.areas = responseData;
    });

    // Φόρτωση λίστας υπηκοοτήτων
    this.countryService.getCountries(true, []).subscribe(responseData => {
      this.nationalities = responseData;
    });

    // Φόρτωση λίστας αδικημάτων απόφασης
    this.genParameterTypeService.getByCategory(GenParameterCategory.Judgment_Fact, []).subscribe(responseData => {
      this.pJudgmentFacts = responseData;
    });

    // Φόρτωση λίστας χαρακτηρισμών ποινής
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_Characterization, []).subscribe(responseData => {
      this.pCharacterizations = responseData;
    });

    // Φόρτωση λίστας διάρκειας ποινής
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRecord_Duration, []).subscribe(responseData => {
      this.pDurations = responseData;
    });

    // Φόρτωση λίστας καταστάσεων θέσης
    this.enumService.getEnumValues('inm.core.enums.option.InmateAreaStatusOption').subscribe(responseData => {
      this.inmateAreaStatuses = responseData;
    });

  }

  initializeArgs() {
    return {
      inmateId: null,
      dcId: null,
      recordDcOrigin: null,
      areaId: null,
      inmateNationalityId: null,
      judgmentFactId: null,
      inmateRecordPenaltyCharacterizationId: null,
      inmateRecordPenaltyDurationId: null,
      inmateAreaStatus: 'ACTIVE'
    };
  }

  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }

  loadTableData() {
    this.table.loadTableData();
  }

  private initializeTableCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'customExtraActions1', width: '3rem', customCell: 'cell1', align: 'center'},
      {field: 'inmateFullName', header: this.translate.instant('inmateArea.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
      {field: 'inmateRecordCode', header: this.translate.instant('inmateArea.inmateRecordCode'), sortField: 'inm/QInmateRecord.inmateRecord.code', width: '8rem'},
      {field: 'inmateRecordPenaltyCharacterization', header: this.translate.instant('inmateArea.inmateRecordPenaltyCharacterization'),
        sortField: 'cm/QGenParameter.inmateRecordCharacterization.description', width: '10rem'},
      {field: 'inmateRecordPenaltyDuration', header: this.translate.instant('inmateArea.inmateRecordPenaltyDuration'),
        sortField: 'cm/QGenParameter.inmateRecordDuration.description', width: '8rem'},
      {field: 'judgmentFactDescription', header: this.translate.instant('inmateArea.judgmentFactDescription'),
        sortField: 'cm/QGenParameter.judgmentFact.description', width: '8rem'},
      {field: 'areaFullDescription', header: this.translate.instant('inmateArea.areaFullDescription'), sortField: this.enableSortingByArea(), width: '10rem'},
      {field: 'medComments', header: this.translate.instant('inmateArea.medComments'), width: '10rem'},
      {field: 'inmateNationality', header: this.translate.instant('inmateArea.inmateNationality'), width: '8rem'},
      {field: 'hasEscapeTimeLabel', header: this.translate.instant('inmateArea.hasEscapeTime'), width: '8rem', align: 'center'},
      {field: 'inmateLaborDescription', header: this.translate.instant('inmateArea.inmateLabor'), width: '10rem'},
      {field: 'inmateAbsenceDescription', header: this.translate.instant('inmateArea.absence'), width: '10rem'}
    ];
  }

  enableSortingByArea() {
    // Ενεργοποίηση ταξινόμησης βάσει της Περιοχής Κράτησης, αν δε γίνει αναζήτηση στους Κρατούμενους Χωρίς Θέση
    if (this.args.inmateAreaStatus === 'WITHOUTINMATEAREA') {
      return '';
    } else {
      return 'inm/QArea.area.fullDescription';
    }
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);

    // Αποεπιλογή εγγραφής
    this.selectedInmateAreaRecord = null;

    // Ανανέωση δεδομένων για 'Ενεργή Θέση'
    setTimeout(() => {
      this.loadTableData();
    });
  }

  onSelectInmateArea() {
    // Άντληση πληροφοριών επιλεγμένης εγγραφής από τον πίνακα
    this.selectedInmateAreaRecord = this.table.selectedItems;
  }

  onUnselectInmateArea() {
    this.selectedInmateAreaRecord = null;
  }

  inmateAreaStatusChanged() {
    // Αν επιλεγεί η Κατάσταση Θέσης 'Χωρίς Θέση', τότε επαναφορά του arg: 'areaId'
    if (this.args.inmateAreaStatus === 'WITHOUTINMATEAREA') {
      this.args.areaId = null;
    }
    // Ενημέρωση δεδομένων
    this.cols = this.initializeTableCols();
    this.loadTableData();
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
