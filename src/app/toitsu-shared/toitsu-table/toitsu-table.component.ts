import {AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {LazyLoadEvent} from 'primeng/api';
import {Table} from 'primeng/table';
import {ToitsuTableService} from './toitsu-table.service';
import {ToitsuToasterService} from '../toitsu-toaster/toitsu-toaster.service';
import {ExportService} from '../../cm/export/export.service';
import {ExportModel} from '../../cm/export/export.model';
import {AuthService} from '../../toitsu-auth/auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-toitsu-table',
  templateUrl: './toitsu-table.component.html'
})
export class ToitsuTableComponent implements OnInit, AfterViewInit {
  
  @Input() url: string;
  @Input() footerUrl: string;
  @Input() cols: {}[];
  @Input() args: {};
  @Input() viewLink: string;
  @Input() excel: boolean;
  @Input() exportModel: ExportModel;
  
  @Output() loadComplete = new EventEmitter<{}>();
  @Output() loadError = new EventEmitter<{}>();
  @Output() rowClicked = new EventEmitter<{}>();
  @Output() rowDblClicked = new EventEmitter<{}>();
  
  @Input() selectionMode: string = 'single';
  selectedItems = [];
  @Output() rowSelected = new EventEmitter<{}>();
  @Output() rowUnselected = new EventEmitter<{}>();
  
  @Input() rowsPerPageOptions = this.toitsuTableService.ROWS_PER_PAGE_OPTIONS;
  @Input() first = this.toitsuTableService.FIRST;
  @Input() rows = this.toitsuTableService.ROWS;
  @Input() sortField = 'id';
  @Input() sortOrder = 1;
  
  @Input('loadOnInit') lazyLoadOnInit = false;
  
  @Input() scrollHeight = '500px';
  smallScreen = false;
  fixedColWidths = true;
  
  @Input() rowClass: (rowData: any) => string;
  
  @ContentChild('cell1', {static: false}) cell1Ref: TemplateRef<any>;
  @ContentChild('cell2', {static: false}) cell2Ref: TemplateRef<any>;
  @ContentChild('cell3', {static: false}) cell3Ref: TemplateRef<any>;
  @ContentChild('cell4', {static: false}) cell4Ref: TemplateRef<any>;
  
  data: {}[];
  footer: {};
  totalRecords: number;
  loading: boolean;
  
  storedPaging = {};
  
  @ViewChild(Table) table: Table;
  
  constructor(private http: HttpClient,
              private router: Router,
              private renderer: Renderer2,
              private elementRef: ElementRef,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuTableService: ToitsuTableService,
              private exportService: ExportService,
              public authService: AuthService
  ) {}
  
  ngOnInit() {
    this.loading = !!this.lazyLoadOnInit;
    this.smallScreen = (window.innerWidth <= 576);
    
    // To css max-width-fit-content θέλουμε να εφαρμόζεται μόνο όταν οι στήλες είναι δηλωμένες με rem.
    // Αν βρεθεί έστω και μια στήλη με πλάτος δηλωμένο σε ποσοστό, ορίζεται μια μεταβλητή η οποία απενεργοποιεί το css αυτό.
    if (this.cols && this.cols.length > 0) {
      let colWidths = this.cols.map(item => item['width']);
      if (colWidths && colWidths.length > 0) {
        let colWidthsWithPercentage = colWidths.find(item => item.includes('%'));
        if (colWidthsWithPercentage && colWidthsWithPercentage.length > 0) {
          this.fixedColWidths = false;
        }
      }
    }
  }
  
  ngAfterViewInit() {
    let element = this.elementRef.nativeElement.querySelector('.p-datatable-wrapper');
    this.renderer.removeStyle(element, 'height');
    this.renderer.setStyle(element, 'max-height', this.scrollHeight);
    if (this.smallScreen) {
      this.renderer.setStyle(element, 'overflow-y', 'scroll');
    }
  }
  
  public loadTableData(event?: LazyLoadEvent) {
    this.clearSelectedItems();
    
    this.loading = true;
    
    // Αρχικοποίηση των sorting/paging πεδίων από τις τιμές πάνω στο p-table
    // Αν δεν υπάρχουν, χρησιμοποιούνται οι δηλωμένες τιμές
    let theFirst = (this.table && this.table._first) ? this.table._first : this.first;
    let theRows = (this.table && this.table._rows) ? this.table._rows : this.rows;
    let theSortField = (this.table && this.table._sortField) ? this.table._sortField : this.sortField;
    let theSortOrder = (this.table && this.table._sortOrder) ? this.table._sortOrder : this.sortOrder;
    
    if (event && event.hasOwnProperty('sortField')) {
      // Event που προκλήθηκε μέσα από το p-table (αλλαγή σελίδας ή μεγέθους σελίδας, sorting)
      
      // event.first = First row offset
      // event.rows = Number of rows per page
      // event.sortField = Field name to sort with
      // event.sortOrder = Sort order as number, 1 for asc and -1 for desc
      
      theFirst = event.first;
      theRows = event.rows;
      theSortField = event.sortField;
      theSortOrder = event.sortOrder;
    }
    
    const page = String(theFirst / theRows + 1);
    const rows = String(theRows);
    const sidx = theSortField ? theSortField : 'id';
    const sord = theSortOrder === 1 ? 'asc' : 'desc';
    
    let pageParams = new HttpParams();
    pageParams = pageParams.append('page', page);
    pageParams = pageParams.append('rows', rows);
    pageParams = pageParams.append('sidx', sidx);
    pageParams = pageParams.append('sord', sord);
    
    this.http
      .post<PageModel>(
        environment.apiBaseUrl + this.url,
        this.args,
        {
          params: pageParams
        }
      )
      .subscribe({
        next: (responseData) => {
          this.data = responseData.content;
          this.totalRecords = responseData.totalElements;
          
          this.storedPaging = {
            first: theFirst,
            rows: theRows,
            sortField: theSortField,
            sortOrder: theSortOrder
          };
          
          if (!!this.rowClass) {
            this.data.forEach(datum => {
              let clazz = this.rowClass(datum);
              if (clazz) {
                datum['class'] = clazz;
              }
            });
          }
          
          this.loadComplete.emit(responseData);
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
          
          this.loadError.emit(responseError);
        }
      }).add(() => {
        this.loading = false;
      });
    
    // Κλήση για ανάκτηση δεδομένων για το footer
    if (this.footerUrl) {
      this.http
        .post(
          environment.apiBaseUrl + this.footerUrl,
          this.args
        )
        .subscribe({
          next: (responseData) => {
            this.footer = responseData;
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
            this.footer = null;
          }
        });
    }
  }
  
  onRowClick(rowData) {
    this.rowClicked.emit(rowData);
  }
  
  onRowDblClick(rowData) {
    this.rowDblClicked.emit(rowData);
    
    if (this.viewLink) {
      this.router.navigate([this.viewLink, rowData.id]);
    }
  }
  
  onRowSelect(rowData) {
    this.rowSelected.emit(rowData);
  }
  
  onRowUnselect(rowData) {
    this.rowUnselected.emit(rowData);
  }
  
  clearSelectedItems() {
    this.selectedItems = [];
  }
  
  exportToExcel() {
    this.loading = true;
    
    let sidx = this.sortField ? this.sortField : 'id';
    let sord = this.sortOrder === 1 ? 'asc' : 'desc';
    
    let searchString = JSON.stringify(this.args);
    let model = this.exportService.prepareExcelModel(this.cols);
    
    this.exportService.exportToExcel(searchString, model, sidx, sord, this.exportModel)
      .subscribe({
        next: (responseData) => {
          this.exportService.saveAsExcelFile(responseData, this.exportModel.title, '.xlsx');
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.loading = false;
      });
  }
}

class PageModel {
  content: any[];
  totalElements: number;
}
