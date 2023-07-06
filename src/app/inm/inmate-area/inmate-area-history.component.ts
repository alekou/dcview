import {Component, OnInit, ViewChild} from '@angular/core';
import {inmateAreaConsts} from './inmate-area.consts';
import {InmateAreaService} from './inmate-area.service';
import {InmateService} from '../inmate/inmate.service';
import {AreaService} from '../area/area.service';
import {EnumService} from '../../cm/enum/enum.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {inmateConsts} from '../inmate/inmate.consts';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {
  InmateAreaSetInactiveDialogComponent
} from './inmate-area-set-inactive-dialog/inmate-area-set-inactive-dialog.component';
import {InmateArea} from './inmate-area.model';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {InmatePhotoService} from '../inmate-photo/inmate-photo.service';


@Component({
  selector: 'app-inmate-area-history',
  templateUrl: './inmate-area-history.component.html',
  styleUrls: ['./inmate-area.css'],
  providers: [
    DynamicDialogRef,
    DynamicDialogConfig
  ]
})

export class InmateAreaHistoryComponent implements OnInit {

  searchOptions = [
    {label: this.translate.instant('inmateArea.history.inmates'), value: 1},
    {label: this.translate.instant('inmateArea.history.fellowInmates'), value: 2},
  ];
  selectedSearchOption = this.searchOptions[0].value;

  inmateDialogUrl: string;

  areas = [];
  yesNoEnums = [];

  inmatesIndexUrl = inmateAreaConsts.historyIndexUrl;
  fellowInmatesIndexUrl = inmateAreaConsts.historyFellowInmatesIndexUrl;

  inmatesCols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'customExtraActions1', width: '3rem', customCell: 'cell1', align: 'center'},
    {field: 'customExtraActions2', width: '3rem', customCell: 'cell2', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('inmateArea.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'inmateRecordCode', header: this.translate.instant('inmateArea.inmateRecordCode'), sortField: 'inm/QInmateRecord.inmateRecord.code', width: '8rem'},
    {field: 'inmateRecordExitDate', header: this.translate.instant('inmateArea.inmateRecordExitDate'), sortField: 'inm/QInmateRecord.inmateRecord.exitDate', width: '9rem', align: 'center'},
    {field: 'areaFullDescription', header: this.translate.instant('inmateArea.areaFullDescription'), sortField: 'inm/QArea.area.fullDescription', width: '10rem'},
    {field: 'activeLabel', header: this.translate.instant('inmateArea.active'), width: '8rem', align: 'center'},
    {field: 'entryDate', header: this.translate.instant('inmateArea.entryDate'), sortField: 'entryDate', width: '10rem', align: 'center'},
    {field: 'exitDate', header: this.translate.instant('inmateArea.exitDate'), sortField: 'exitDate', width: '10rem', align: 'center'},
    {field: 'reason', header: this.translate.instant('inmateArea.reason'), sortField: 'reason', width: '10rem'},
    {field: 'comments', header: this.translate.instant('inmateArea.comments'), sortField: 'comments', width: '10rem'},
    {field: 'inmateAbsenceDescription', header: this.translate.instant('inmateArea.absence'), width: '10rem'}
  ];

  fellowInmatesCols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('inmateArea.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'areaFullDescription', header: this.translate.instant('inmateArea.areaFullDescription'), width: '10rem'},
    {field: 'activeLabel', header: this.translate.instant('inmateArea.active'), width: '8rem', align: 'center'},
    {field: 'entryDate', header: this.translate.instant('inmateArea.entryDate'), width: '12rem', align: 'center'},
    {field: 'exitDate', header: this.translate.instant('inmateArea.exitDate'), width: '12rem'},
    {field: 'reason', header: this.translate.instant('inmateArea.reason'), width: '15rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('inmateArea.comments'), width: '15rem'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'inm/QInmate.inmate.lastName',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  inmateArgs = this.storedArgs ? this.storedArgs : this.initializeInmateArgs();
  fellowInmateArgs = this.initializeFellowInmateArgs();

  exportModel = new ExportModel(this.translate.instant('inm.subgroup.inmateArea.history'), 'inmateAreaController', 'inmateAreaHistoryIndex', 'inm.args.InmateAreaHistoryArgs');

  rowClass(rowData) {
    if ((rowData.active)) {
      return 'font-bold';
    }
  }

  @ViewChild('inmatesTable') inmatesTable: ToitsuTableComponent;
  @ViewChild('fellowInmatesTable') fellowInmatesTable: ToitsuTableComponent;

  inmateAreaToSetInactive: InmateArea = new InmateArea();

  selectedInmateAreaRecord = null;

  selectedFellowInmateAreaRecord = null;


  constructor(
    private inmateAreaService: InmateAreaService,
    private inmateService: InmateService,
    public inmatePhotoService: InmatePhotoService,
    private areaService: AreaService,
    private enumService: EnumService,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService,
    private router: Router,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Φόρτωση λίστας κρατουμένων
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    // Φόρτωση λίστας
    this.areaService.getAllAreas(this.authService.getUserDcId()).subscribe(responseData => {
      this.areas = responseData;
    });

    // Φόρτωση λίστας καταστάσεων θέσης (YesNoEnumOption)
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption')
      .subscribe(responseData => {
        this.yesNoEnums = responseData;
      });

  }

  initializeInmateArgs() {
    return {
      inmateId: null,
      areaId: null,
      inmateAreaStatus: null,
      inmateRecordExitDateAfter: null,
      inmateRecordExitDateBefore: null,
      entryDateAfter: null,
      entryDateBefore: null,
      exitDateAfter: null,
      exitDateBefore: null
    };
  }

  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.inmateArgs, this.inmatesTable);
  }

  loadInmatesTableData() {
    this.inmatesTable.loadTableData();
  }

  clearInmateArgs() {
    this.inmateArgs = this.initializeInmateArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
    // Αποεπιλογή εγγραφής από τους πίνακες
    this.selectedInmateAreaRecord = null;
    this.selectedFellowInmateAreaRecord = null;
  }

  onSelectInmateArea() {

    // Άντληση πληροφοριών επιλεγμένης εγγραφής από τον πίνακα κρατουμένων
    this.selectedInmateAreaRecord = this.inmatesTable.selectedItems;

    // Αποεπιλογή προηγούμενου συγκρατουμένου
    this.selectedFellowInmateAreaRecord = null;

    // Αρχικοποίηση του id Κρατουμένου για αναζήτηση συγκρατουμένων
    this.fellowInmateArgs.inmateId = this.selectedInmateAreaRecord.inmate.id;

    // Εμφάνιση πίνακα και ανανέωση δεδομένων Συγκρατούμενων
    if (this.selectedSearchOption === this.searchOptions[0].value) {
      this.selectedSearchOption = this.searchOptions[1].value;
      setTimeout(() => {
        this.loadFellowInmatesTableData();
      });
    } else {
      this.loadFellowInmatesTableData();
    }

  }

  onUnselectInmateArea() {
    this.selectedInmateAreaRecord = null;
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  private initializeFellowInmateArgs() {
    return {
      inmateId: null,
      areaId: null,
      inmateAreaStatus: null,
      inmateRecordExitDateAfter: null,
      inmateRecordExitDateBefore: null,
      entryDateAfter: null,
      entryDateBefore: null,
      exitDateAfter: null,
      exitDateBefore: null,
      fellowInmateId: null
    };
  }

  loadFellowInmatesTableData() {
    this.fellowInmatesTable.loadTableData();
  }

  clearFellowInmateArgs() {
    this.fellowInmateArgs = this.initializeFellowInmateArgs();
    // Αποεπιλογή εγγραφής από τους πίνακες
    this.selectedInmateAreaRecord = null;
    this.selectedFellowInmateAreaRecord = null;
  }

  onSelectFellowInmateArea() {
    // Άντληση πληροφοριών επιλεγμένης εγγραφής από τον πίνακα συγκρατουμένων
    this.selectedFellowInmateAreaRecord = this.fellowInmatesTable.selectedItems;
  }

  onUnselectFellowInmateArea() {
    this.selectedFellowInmateAreaRecord = null;
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  openSetInactiveDialog(rowData) {

    this.toitsuToasterService.clearMessages();
    this.initializeInmateAreaToSetInactive(rowData);

    const emptyCellDialog = this.dialogService.open(InmateAreaSetInactiveDialogComponent, {
      header: this.translate.instant('inmateArea.history.emptyCell'),
      data: {
        inmateAreaToSetInactive: this.inmateAreaToSetInactive
      }
    });

    emptyCellDialog.onClose.subscribe(result => {
      if (result) {
        this.dynamicDialogRef.close(result);
        // Ανανέωση δεδομένων Κρατουμένων
        this.loadInmatesTableData();
      }
    });
  }

  initializeInmateAreaToSetInactive(rowData) {
    // Ορισμός πεδίων της Θέσης κρατουμένου προς επεξεργασία
    this.inmateAreaToSetInactive.id = rowData.id;
    this.inmateAreaToSetInactive.inmateId = rowData.inmate.id;
    this.inmateAreaToSetInactive.inmateRecordId = rowData.inmateRecordId;
    this.inmateAreaToSetInactive.areaId = rowData.areaId;
    this.inmateAreaToSetInactive.active = false;
    this.inmateAreaToSetInactive.reserved = rowData.reserved;
    this.inmateAreaToSetInactive.reservationDate = rowData.reservationDate;
    this.inmateAreaToSetInactive.entryDate = rowData.entryDate;
    this.inmateAreaToSetInactive.exitDate = rowData.exitDate;
    this.inmateAreaToSetInactive.previousAreaDescription = rowData.previousAreaDescription;
    this.inmateAreaToSetInactive.reason = rowData.reason;
    this.inmateAreaToSetInactive.comments = rowData.comments;
  }

}
