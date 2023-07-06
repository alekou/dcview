import {Component, OnInit, ViewChild} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {AreaService} from '../area/area.service';
import {ActivatedRoute} from '@angular/router';
import {inmateConsts} from '../inmate/inmate.consts';
import {inmateAreaConsts} from './inmate-area.consts';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {InmateArea} from './inmate-area.model';
import {DateService} from '../../toitsu-shared/date.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InmateAreaMoveDialogComponent} from './inmate-area-move-dialog/inmate-area-move-dialog.component';
import {InmateAreaEditDialogComponent} from './inmate-area-edit-dialog/inmate-area-edit-dialog.component';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {InmatePhotoService} from '../inmate-photo/inmate-photo.service';
import {InmateAreaService} from './inmate-area.service';
import {OverlayPanel} from 'primeng/overlaypanel';


@Component({
  selector: 'app-inmate-area-manage',
  templateUrl: './inmate-area-manage.component.html',
  styleUrls: ['./inmate-area.css'],
  providers: [
    DynamicDialogRef,
    DynamicDialogConfig
  ]
})

export class InmateAreaManageComponent implements OnInit {

  inmateAreaSumUp: any = this.initializeInmateAreaSumUp();
  @ViewChild('sumUpOverlayPanel') sumUpOverlayPanel: OverlayPanel;
  loadingInmateAreaSumUp: boolean;

  allAreasHierarchy: TreeNode[];
  topAreas = [];
  reservedInmateAreas = [];
  selectedAreaNode: TreeNode;
  loadingAreasTree: boolean;

  enableSearch: boolean = false;
  searchResultsTree: TreeNode[];
  areaCode: string = null;
  loadingSearchAreasTree: boolean;

  inmateDialogUrl: string;

  url = inmateAreaConsts.manageIndexUrl;

  cols = this.initializeTableCols();

  paging = {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'inm/QInmate.inmate.lastName',
    sortOrder: 1
  };

  args = this.initializeArgs();
  @ViewChild('table') table: ToitsuTableComponent;
  selectedInmateAreaRecord = null;

  lastInmateArea: InmateArea = new InmateArea();
  newInmateArea: InmateArea = new InmateArea();

  inmateAreaToEdit: InmateArea = new InmateArea();



  constructor(
    private inmateAreaService: InmateAreaService,
    private areaService: AreaService,
    public inmatePhotoService: InmatePhotoService,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dateService: DateService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {

    // Φόρτωση των ανωτάτων περιοχών με τη χρήση του TopAreasResolver
    this.topAreas = this.route.snapshot.data['record'];

    // Φόρτωση λίστας κρατημένων θέσεων στο κατάστημα
    this.inmateAreaService.getActiveReservedInmateAreasInDc().subscribe((responseData) => {
      this.reservedInmateAreas = responseData;
    });

    // Αρχικοποίηση χωροταξικής δομής των περιοχών κράτησης
    this.loadingAreasTree = true;
    this.initializeAreaStructure();
    this.loadingAreasTree = false;

    // Φόρτωση λίστας κρατουμένων
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }

  showInmateAreaSumUp(event) {
    // Αν δεν έχουν φορτωθεί ήδη τα σύνολα, ανάκτηση από τη βάση δεδομένων
    if (this.inmateAreaSumUp.alreadyLoaded === false) {
      this.loadingInmateAreaSumUp = true;
      // Αρχικοποίηση πεδίων σύνοψης θέσεων κρατουμένων, με μηδενικές τιμές
      this.inmateAreaSumUp = this.initializeInmateAreaSumUp();
      // Ανάκτηση Σύνοψης Θέσεων Κρατουμένων για το συνδεδεμένο Κατάστημα Κράτησης
      this.inmateAreaService.getInmateAreaSumUpOfDc().subscribe({
        next: (responseData) => {
          this.inmateAreaSumUp = responseData;
        }
      }).add(() => {
        // Εμφάνιση δεδομένων
        this.inmateAreaSumUp.alreadyLoaded = true;
        this.loadingInmateAreaSumUp = false;
        this.sumUpOverlayPanel.toggle(event);
      });
    } else {
      this.sumUpOverlayPanel.toggle(event);
    }
  }

  initializeInmateAreaSumUp() {
    return {
      totalPower: 0,
      totalAbsences: 0,
      totalPresent: 0,
      totalExpected: 0,
      totalWithPosition: 0,
      totalWithoutPosition: 0,
      totalReservedPositions: 0,
      alreadyLoaded: false
    };
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  initializeAreaStructure() {
    // Δημιουργία κενής περιοχής
    this.allAreasHierarchy = [{
      expandedIcon: 'fa fa-map',
      collapsedIcon: 'fa fa-map-o',
      data: {
        id: -33,
        code: '-',
        fullDescription: '-',
        areaTypeDescription: '-',
        inmates: this.topAreas[this.topAreas.length - 1].inmatesWithoutInmateAreaCount,
        positions: '-',
        availablePositions: '-',
        reservedPositions: '-',
        parent: '-',
      },
      label: 'Χωρίς Θέση ' + '(' + this.topAreas[this.topAreas.length - 1].inmatesWithoutInmateAreaCount + ')',
      leaf: true
    }];

    // Αρχικοποίηση των ανωτάτων περιοχών κράτησης
    this.topAreas.forEach( (topParentArea) => {
      if (topParentArea.positions !== null || undefined) {
        this.allAreasHierarchy.push({
          expandedIcon: 'fa fa-map',
          collapsedIcon: 'fa fa-map-o',
          data: {
            id: topParentArea.id,
            code: topParentArea.code,
            fullDescription: topParentArea.fullDescription,
            areaTypeDescription: topParentArea.areaTypeDescription,
            inmates: (topParentArea.positions - topParentArea.availablePositions - topParentArea.reservedPositions),
            positions: topParentArea.positions,
            availablePositions: topParentArea.availablePositions,
            reservedPositions: topParentArea.reservedPositions,
            parent: '-'
          },
          label: topParentArea.code +
            ' (Κ:' + (topParentArea.positions - topParentArea.availablePositions - topParentArea.reservedPositions) +
            '/Α:' + '*' +
            '/Θ:' + topParentArea.positions +
            '/ΔΘ:' + topParentArea.availablePositions +
            '/ΚΘ:' + topParentArea.reservedPositions + ')',
          leaf: true
        });
      } else {
        this.allAreasHierarchy.push({
          expandedIcon: 'fa fa-map',
          collapsedIcon: 'fa fa-map-o',
          data: {
            id: topParentArea.id,
            code: topParentArea.code,
            fullDescription: topParentArea.fullDescription,
            areaTypeDescription: topParentArea.areaTypeDescription,
            inmates: (topParentArea.positionsSum - topParentArea.availablePositionsSum - topParentArea.reservedPositionsSum),
            positions: topParentArea.positions,
            positionsSum: topParentArea.positionsSum,
            availablePositionsSum: topParentArea.availablePositionsSum,
            reservedPositionsSum: topParentArea.reservedPositionsSum,
            parent: '-'
          },
          label: topParentArea.code +
            ' (Κ:' + (topParentArea.positionsSum - topParentArea.availablePositionsSum - topParentArea.reservedPositionsSum) +
            '/Α:' + '*' +
            '/Θ:' + topParentArea.positionsSum +
            '/ΔΘ:' + topParentArea.availablePositionsSum +
            '/ΚΘ:' + topParentArea.reservedPositionsSum + ')',
          leaf: false
        });
      }
    });
  }

  nodeExpand(event) {
    if (event.node) {
      this.loadingAreasTree = true;
      this.areaService.getChildAreasByParentArea(event.node.data.id, event.node).subscribe({
        next: (responseData) => {
          event.node.children = responseData;
        }
      }).add(() => {
          // Ανανέωση δεδομένων
          this.allAreasHierarchy = [...this.allAreasHierarchy];
          if (this.enableSearch) {
            this.searchResultsTree = [...this.searchResultsTree];
          }
          this.loadingAreasTree = false;
      });
    }
  }

  nodeSelect() {
    // Απο-επιλογή εγγραφής θέσης κρατουμένου
    this.selectedInmateAreaRecord = null;
    // Φόρτωση των κρατούμενων της επιλεγμένης περιοχής
    this.args.areaId = this.selectedAreaNode.data.id;
    this.cols = this.initializeTableCols();
    this.loadTableData();
  }

  searchByAreaCode() {
    if (this.areaCode) {
      this.enableSearch = true;
      this.loadingSearchAreasTree = true;
      this.areaService.getAreasByCode(this.areaCode).subscribe({
        next: (responseData) => {
          this.searchResultsTree = responseData;
        }
      }).add(() => {
        // Ανανέωση δεδομένων
        this.searchResultsTree = [...this.searchResultsTree];
        this.loadingSearchAreasTree = false;
      });
    } else {
      this.enableSearch = false;
    }
  }

  refreshSearchFields() {
    this.areaCode = null;
    this.enableSearch = false;
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  initializeArgs() {
    return {
      inmateId: null,
      areaId: null
    };
  }

  loadTableData() {
    this.table.loadTableData();
  }

  initializeTableCols() {
    return [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'customExtraActions', width: '3rem', customCell: 'cell1', align: 'center'},
      {field: 'inmateFullName', header: this.translate.instant('inmateArea.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
      {field: 'inmateNationality', header: this.translate.instant('inmateArea.inmateNationality'), width: '8rem'},
      {field: 'inmateRecordCode', header: this.translate.instant('inmateArea.inmateRecordCode'), sortField: 'inm/QInmateRecord.inmateRecord.code', width: '8rem'},
      {field: 'inmateRecordPenaltyCharacterization', header: this.translate.instant('inmateArea.inmateRecordPenaltyCharacterization'),
        sortField: 'cm/QGenParameter.inmateRecordCharacterization.description', width: '10rem'},
      {field: 'inmateRecordPenaltyDuration', header: this.translate.instant('inmateArea.inmateRecordPenaltyDuration'),
        sortField: 'cm/QGenParameter.inmateRecordDuration.description', width: '8rem'},
      {field: 'judgmentFactDescription', header: this.translate.instant('inmateArea.judgmentFactDescription'),
        sortField: 'cm/QGenParameter.judgmentFact.description', width: '8rem'},
      {field: 'inmateAbsenceDescription', header: this.translate.instant('inmateArea.absence'), width: '10rem'},
      {field: 'previousAreaDescription', header: this.translate.instant('inmateArea.previousAreaDescription'), sortField: 'previousAreaDescription', width: '10rem'},
      {field: 'areaFullDescription', header: this.translate.instant('inmateArea.areaFullDescription'), sortField: this.enableSortingByArea(), width: '10rem'},
      {field: 'entryDate', header: this.translate.instant('inmateArea.entryDate'), sortField: 'entryDate', width: '10rem', align: 'center'},
      {field: 'reason', header: this.translate.instant('inmateArea.reason'), sortField: 'reason', width: '10rem'},
      {field: 'comments', header: this.translate.instant('inmateArea.comments'), sortField: 'comments', width: '10rem'},
      {field: 'medComments', header: this.translate.instant('inmateArea.medComments'), width: '10rem'},
      {field: 'reservedLabel', header: this.translate.instant('inmateArea.reserved'), sortField: 'reserved', width: '8rem', align: 'center'},
      {field: 'reservationDate', header: this.translate.instant('inmateArea.reservationDate'), sortField: 'reservationDate', width: '10rem', align: 'center'}
    ];
  }

  enableSortingByArea() {
    // Ενεργοποίηση ταξινόμησης βάσει της Περιοχής Κράτησης, αν δεν είναι επιλεγμένη η Κενή Περιοχή(-33)
    if (this.selectedAreaNode) {
      if (this.selectedAreaNode.data.id !== -33) {
        return 'inm/QArea.area.fullDescription';
      } else {
        return '';
      }
    } else {
      return 'inm/QArea.area.fullDescription';
    }
  }

  onSelectInmateArea() {
    // Άντληση πληροφοριών επιλεγμένης εγγραφής από τον πίνακα
    this.selectedInmateAreaRecord = this.table.selectedItems;

    // Αρχικοποίηση της τελευταίας επιλεγμένης θέσης κράτησης
    this.initializeLastInmateArea();

    // Αρχικοποίηση της τελευταίας νέας θέσης κράτησης
    this.initializeNewInmateArea();

    // Αρχικοποίηση της θέσης κράτησης προς επεξεργασία
    this.initializeInmateAreaToEdit();
  }

  onUnselectInmateArea() {
    this.selectedInmateAreaRecord = null;
  }

  private initializeLastInmateArea() {
    // Ορισμός των πεδίων της τελευταίας Θέσης κρατουμένου
    this.lastInmateArea.id = this.selectedInmateAreaRecord.id;
    this.lastInmateArea.inmateId = this.selectedInmateAreaRecord.inmate.id;
    this.lastInmateArea.inmateRecordId = this.selectedInmateAreaRecord.inmateRecordId;
    this.lastInmateArea.areaId = this.selectedInmateAreaRecord.areaId;
    this.lastInmateArea.previousAreaDescription = this.selectedInmateAreaRecord.previousAreaDescription;
    this.lastInmateArea.reason = this.selectedInmateAreaRecord.reason;
    this.lastInmateArea.comments = this.selectedInmateAreaRecord.comments;
    this.lastInmateArea.entryDate = this.selectedInmateAreaRecord.entryDate;
    this.lastInmateArea.exitDate = this.getCurrentDate();
    this.lastInmateArea.reservationDate = this.selectedInmateAreaRecord.reservationDate;
    this.lastInmateArea.reserved = this.selectedInmateAreaRecord.reserved;
    this.lastInmateArea.active = false;
  }

  private initializeNewInmateArea() {
    // Ορισμός πεδίων της νέας Θέσης κρατουμένου
    this.newInmateArea.inmateId = this.selectedInmateAreaRecord.inmate.id;
    this.newInmateArea.inmateRecordId = null;
    this.newInmateArea.previousAreaDescription = this.selectedInmateAreaRecord.areaFullDescription;
    this.newInmateArea.entryDate = this.getCurrentDate();
    this.newInmateArea.active = true;
    this.newInmateArea.reason = null;
    this.newInmateArea.comments = null;
  }

  private initializeInmateAreaToEdit() {
    // Ορισμός πεδίων της Θέσης κρατουμένου προς επεξεργασία
    this.inmateAreaToEdit.id = this.selectedInmateAreaRecord.id;
    this.inmateAreaToEdit.inmateId = this.selectedInmateAreaRecord.inmate.id;
    this.inmateAreaToEdit.inmateRecordId = this.selectedInmateAreaRecord.inmateRecordId;
    this.inmateAreaToEdit.areaId = this.selectedInmateAreaRecord.areaId;
    this.inmateAreaToEdit.active = true;
    this.inmateAreaToEdit.reserved = this.selectedInmateAreaRecord.reserved;
    this.inmateAreaToEdit.reservationDate = this.selectedInmateAreaRecord.reservationDate;
    this.inmateAreaToEdit.entryDate = this.selectedInmateAreaRecord.entryDate;
    if (this.inmateAreaToEdit.reserved && this.inmateAreaToEdit.active) {
      this.inmateAreaToEdit.exitDate = null;
    } else {
      this.inmateAreaToEdit.exitDate = this.selectedInmateAreaRecord.exitDate;
    }
    this.inmateAreaToEdit.previousAreaDescription = this.selectedInmateAreaRecord.previousAreaDescription;
    this.inmateAreaToEdit.reason = null;
    this.inmateAreaToEdit.comments = null;
  }

  getReservedInmateAreaByInmate(rowData) {
    let reservedInmateArea = null;
    // Ανάκτηση κρατημένης θέσης κρατουμένου, από τη λίστα με όλες τις κρατημένες θέσεις στο κατάστημα κράτησης
    if (rowData && this.reservedInmateAreas) {
      reservedInmateArea = this.reservedInmateAreas.find(i => i.inmateId === rowData.inmate.id);
    }
    // Ανάκτηση της πλήρης περιγραφής της κρατημένης θέσης για προβολή
    if (reservedInmateArea !== undefined) {
      rowData.reservedAreaFullDescription = rowData.previousAreaDescription;
      return true;
    }
    return false;
  }

  getCurrentDate() {
    return this.dateService.getCurrentDateString() as unknown as Date;
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  openMoveInmateAreaDialog() {
    this.toitsuToasterService.clearMessages();

    const moveInmateDialog = this.dialogService.open(InmateAreaMoveDialogComponent, {
      header: this.translate.instant('inmateArea.manage.moveInmate'),
      width: '70%',
      data: {
        selectedInmateAreaRecord: this.selectedInmateAreaRecord,
        newInmateArea: this.newInmateArea,
        lastInmateArea: this.lastInmateArea
      },
      closable: false
    });

    moveInmateDialog.onClose.subscribe(result => {
      if (result) {
        this.dynamicDialogRef.close(result);
      }
    });
  }

  openEditInmateAreaDialog() {
    this.toitsuToasterService.clearMessages();

    // Αν ο επιλεγμένος έχεις θέση κράτησης
    if (this.inmateAreaToEdit.id !== -33) {
      const editInmateAreaDialog = this.dialogService.open(InmateAreaEditDialogComponent, {
        header: this.translate.instant('inmateArea.manage.editPlacement'),
        width: '70%',
        data: {
          inmateAreaToEdit: this.inmateAreaToEdit
        },
        closable: false
      });
      editInmateAreaDialog.onClose.subscribe(result => {
        if (result) {
          this.dynamicDialogRef.close(result);
        }
      });
      // Αν ο επιλεγμένος δεν έχεις θέση κράτησης
    } else if (this.inmateAreaToEdit.id === -33 || null || undefined) {
      const warningInmateAreaDialog = this.dialogService.open(InmateAreaEditDialogComponent, {
        header: this.translate.instant('inmateArea.warning.invalidRecord'),
        width: '30%',
        data: {
          inmateAreaToEdit: this.inmateAreaToEdit
        }
      });
    }
  }

  // TODO: Να μην εμφανίζεται η σελίδα στον χρήστη: Υπουργείο

}
