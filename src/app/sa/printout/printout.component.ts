import {Component, OnInit} from '@angular/core';
import {PrintoutReportService} from '../printout-report/printout-report.service';
import {ActivatedRoute} from '@angular/router';
import {EnumService} from '../../cm/enum/enum.service';
import {InmateService} from '../../inm/inmate/inmate.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {PrintoutService} from './printout.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {DomSanitizer} from '@angular/platform-browser';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import * as fileSaver from 'file-saver';
import {DateService} from '../../toitsu-shared/date.service';
import {TransferTypeService} from '../transfer-type/transfer-type.service';
import {AreaService} from '../../inm/area/area.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-printout-list',
  templateUrl: './printout.component.html',
  styleUrls: ['./printout.component.css']
})
export class PrintoutComponent implements OnInit {
  dcSection;
  sectionReports = [];
  htmlContent;
  hasArgs = false;
  printUsedArgs = [];
  inmates = [];
  inmateDialogUrl: string = inmateConsts.lastRecordIndexUrl;
  inmatesLoaded = false;
  reportName;
  reportDescription;
  argsClass;
  isReportClicked = false;
  initialListIsEmpty = false;
  
  constructor(
    private printoutReportService: PrintoutReportService,
    private transferTypeService: TransferTypeService,
    private authService: AuthService,
    private areaService: AreaService,
    private printoutService: PrintoutService,
    private dateService: DateService,
    private genParameterTypeService: GenParameterTypeService,
    private inmateService: InmateService,
    private route: ActivatedRoute,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuToasterService: ToitsuToasterService,
    private sanitizer: DomSanitizer,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    // Παίρνουμε το τμήμα απο το url για ανάκτηση της λίστας των εκτυπωτικών με βάση το τμήμα.
    this.dcSection = this.route.snapshot.pathFromRoot[4].routeConfig.path;
    
    this.printoutReportService.getPrintoutReportListBySection(this.dcSection).subscribe(responseData => {
      if (responseData && responseData.length > 0) {
        this.sectionReports = responseData;
      }
      else {
        this.initialListIsEmpty = true;
      }
    });
  }
  
  convertArrayToObject() {
    // Μετατροπή της λίστας σε αντικείμενο παραμετρικών προς αποστολή στο backend
    return this.printUsedArgs.reduce((result, obj) => {
      // Σε περίπτωση εκτυπωτικού χωρίς κριτήρια επιστρέφει κατευθείαν άδειο obj.
      if (obj.name === null) {
        return {};
      }
      // Σε περίπτωση boolean και enum χρησιμοποιούμε το enum service το οποίο επιστρέφει obj γι αυτό έχουμε αυτήν τη διαχείριση.
      else if (obj.argValue && (obj.argType === 'BOOLEAN' || obj.argType === 'ENUM')) {
        if (obj.argValue.value === 'YES') {
          obj.argValue = true;
          result[obj.name] = obj.argValue;
        } 
        else if (obj.argValue.value === 'NO') {
          obj.argValue = false;
          result[obj.name] = obj.argValue;
        } 
        else {
          result[obj.name] = obj.argValue.value;
        }
      }
      else {
        result[obj.name] = obj.argValue;
      }
      return result;
    }, {});
  }
  
  createReportHtml() {
    this.printoutService.createPrintoutHtml(this.reportName, this.convertArrayToObject()).subscribe({
      next: (responseData) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(responseData['content']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  createReportPdf() {
    this.printoutService.createPrintoutPdf(this.reportName, this.convertArrayToObject()).subscribe({
      next: (responseData) => {
        let file = new Blob([responseData], {type: 'application/pdf'});
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      error: (responseError) => {
        let decodedString = new TextDecoder().decode(responseError.error);
        try {
          let jsonData = JSON.parse(decodedString);
          this.toitsuToasterService.apiValidationErrors({status: 422, error: jsonData});
        }
        catch (e) {
          console.error(decodedString);
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  createReportXls() {
    this.toitsuBlockUiService.blockUi();
    
    this.printoutService.createPrintoutXls(this.reportName, this.convertArrayToObject()).subscribe({
      next: (responseData) => {
        const data: Blob = new Blob([responseData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        
        fileSaver.saveAs(data, this.reportDescription + '_' + this.dateService.getCurrentDateString() + '.xls');
      },
      error: (responseError) => {
        let decodedString = new TextDecoder().decode(responseError.error);
        try {
          let jsonData = JSON.parse(decodedString);
          this.toitsuToasterService.apiValidationErrors({status: 422, error: jsonData});
        }
        catch (e) {
          console.error(decodedString);
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  reportClicked(report) {
    if (report) {
      this.isReportClicked = true;
    }
    
    this.printUsedArgs = [];
    this.reportName = report.name;
    this.argsClass = report.argsClass;
    this.reportDescription = report.description;
    
    if (report.printoutReportArgs) {
      this.hasArgs = true;
      for (let i = 0; i < report.printoutReportArgs.length; i++) {
        report.printoutReportArgs[i].argValue = null;
        report.printoutReportArgs[i].dropdownOptions = [];
        
        // Σε περίπτωση κρατουμένου φορτώνουμε μια φορά τη λίστα γτ και σε πολλαπλότητα θα διαλέξουμε απο την ίδια.
        if (report.printoutReportArgs[i].argType === 'INMATE' && !this.inmatesLoaded) {
          this.inmateService.getLastRecordInmates().subscribe(responseData => {
            if (responseData) {
              this.inmates = responseData;
              this.inmatesLoaded = true;
            }
          });
        }
        
        // Σε περίπτωση παραμετρικού
        if (report.printoutReportArgs[i].argType === 'GEN_PARAMETER') {
          let category = GenParameterCategory[report.printoutReportArgs[i].genParameterCategory];
          this.genParameterTypeService.getByCategory(category, []).subscribe(responseData => {
            report.printoutReportArgs[i].dropdownOptions = responseData;
          });
        }
        
        // Σε περίπτωση λίστας παραμετρικών 
        if (report.printoutReportArgs[i].argType === 'GEN_PARAMETER_LIST') {
          let category = GenParameterCategory[report.printoutReportArgs[i].genParameterCategory];
          this.genParameterTypeService.getByCategory(category, []).subscribe(responseData => {
            report.printoutReportArgs[i].dropdownOptions = responseData;
          });
        }
        
        // Σε περίπτωση boolean
        if (report.printoutReportArgs[i].argType === 'BOOLEAN') {
          this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
            report.printoutReportArgs[i].dropdownOptions = responseData;
            report.printoutReportArgs[i].redropdownOptionValue = 'value';
            report.printoutReportArgs[i].dropdownOptionLabel = 'label';
          }); 
        }
        
        // Σε περίπτωση enum
        if (report.printoutReportArgs[i].argType === 'ENUM') {
          this.enumService.getEnumValues(report.printoutReportArgs[i].enumPath).subscribe(responseData => {
            report.printoutReportArgs[i].dropdownOptions = responseData;
            report.printoutReportArgs[i].redropdownOptionValue = 'value';
            report.printoutReportArgs[i].dropdownOptionLabel = 'label';
          });
        }
        
        if (report.printoutReportArgs[i].argType === 'DROPDOWN') {
          // Σε περίπτωση τύπου μεταγωγής
          if (report.printoutReportArgs[i].name === 'TransferTypeId') {
            this.transferTypeService.getActiveTransferTypesByUserDc(this.authService.getUserDcId()).subscribe(responseData => {
              report.printoutReportArgs[i].dropdownOptions = responseData;
            });
          }
          
          // Σε περίπτωση περιοχής
          if (report.printoutReportArgs[i].name === 'areaId') {
            this.areaService.getAllAreas(this.authService.getUserDcId()).subscribe(responseData => {
              report.printoutReportArgs[i].dropdownOptions = responseData;
            });
          }
        }
        
        // TODO Μόλις βάλουμε τα εκτυπωτικά θα μπούνε οι λίστες που χρειαζόμαστε για τα dropdown.
        this.printUsedArgs.push(report.printoutReportArgs[i]);
      }
    }
  }
}
