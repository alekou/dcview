import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ReportService} from './report.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Report} from './report.model';
import {GrammarService} from './grammar/grammar.service';
import {Grammar} from './grammar/grammar.model';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-tr-report-view',
  templateUrl: 'report-view.component.html'
})
export class ReportViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) reportForm: NgForm;
  reportParams: {};
  recreateParams: any;
  id: number;
  report: Report = new Report();
  subsystem: string;

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private reportService: ReportService,
    private grammarService: GrammarService,
    public authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    this.reportParams = this.router.getCurrentNavigation().extras.state;
    this.subsystem = this.activatedRoute.snapshot.pathFromRoot[1].routeConfig.path;
  }

  ngOnInit() {
    // id from route
    this.id = +this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      // Get existing report by id

      this.report = this.activatedRoute.snapshot.data['record'];

      // Set ckeditor readOnly if needed
      if (this.report.templateId !== null){
        this.editorOptions['readOnly'] = !this.report.canEdit;
      }
    } else if (this.reportParams) {
      // Create new report from params
      // Create the report

      this.reportService.createReport(this.reportParams).subscribe({
        next: (responseData: Report) => {
          this.report.title = responseData.title;
          this.report = responseData;
          // Set ckeditor readOnly if needed
          if (this.report.templateId !== null){
            this.editorOptions['readOnly'] = !this.report.canEdit;
          }
        }
      });
    } else {

      this.router.navigate(['/']);
    }
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.reportForm.dirty;
  }
  saveReport() {
    this.toitsuToasterService.clearMessages();

    this.toitsuBlockUiService.blockUi();

    this.reportService.saveReport(this.report).subscribe({
      next: (responseData: Report) => {
        this.toitsuToasterService.showSuccessStay();
        this.reportForm.form.markAsPristine();
        if (!this.id) {
          
          this.router.navigate(['/' + this.subsystem + '/report/view', responseData.id]);
        } else {
          this.report = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  recreateReport() {
    if (!this.id){
      this.recreateParams = this.reportParams;
      this.recreateParams.protocolNo = this.report.protocolNo;
      this.recreateParams.protocolDate = this.report.protocolDate;
    } else {
      this.recreateParams = this.report;
      this.recreateParams.id = this.id;
      this.recreateParams.application = this.subsystem.toUpperCase();
    }

    this.confirmationService.confirm({
      message: this.translate.instant('report.recreate.confirmation'),
      accept: () => {
        this.reportService.createReport(this.recreateParams).subscribe({
          next: (responseData: Report) => {
            this.report = responseData;
          }
        });
      }
    });
  }
  saveGrammar() {
    this.toitsuToasterService.clearMessages();

    this.toitsuBlockUiService.blockUi();

    this.grammarService.saveGrammarList(this.report.grammarList).subscribe({
      next: (responseData: Grammar[]) => {
        this.toitsuToasterService.showSuccessStay();
        this.reportForm.form.markAsPristine();
        this.report.grammarList = responseData;
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  editorOptions = {
    language: 'el',
    allowedContent: true,
    extraAllowedContent: 'input[*]',
    extraPlugins: 'tableresize,base64image,imagebrowser,lineheight,scayt', // caution on plugins declaring order
    removePlugins: 'format,colorbutton,language',
    removeButtons: 'Flash,Smiley,SpecialChar,Iframe,Save,Templates,Form,Checkbox,Radio,Textarea,Select,Button,ImageButton,HiddenField,UIColor,Maximize,Link,Unlink,Anchor,About',
    enterMode: 2,
    htmlEncodeOutput: false,
    entities: false,
    height: '400px',
    startupOutlineBlocks: true,
    tabSpaces: 4,
    font_names: 'Arial/Arial, Helvetica, sans-serif;' +
      'Calibri/Calibri, Arial, sans-serif;' +
      'Cambria/Cambria, Georgia, serif;' +
      'Comic Sans MS/Comic Sans MS, cursive;' +
      'Courier New/Courier New, Courier, monospace;' +
      'Garamond/EB Garamond 12;' +
      'Georgia/Georgia, serif;' +
      'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
      'Tahoma/Tahoma, Geneva, sans-serif;' +
      'Times New Roman/Times New Roman, Times, serif;' +
      'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
      'Verdana/Verdana, Geneva, sans-serif'
  } as unknown as string;



}
