import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {TemplateService} from './template.service';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Template} from './template.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-tr-template-view',
  templateUrl: 'template-view.component.html'
})
export class TemplateViewComponent implements OnInit, ExitConfirmation {
  @ViewChild(NgForm) templateForm: NgForm;
  template: Template;
  id: number;
  applications = [];
  entities = [];
  templateDefinitions = [];
  doctorTypes = [];
  templateDefinitionTagsList: any;

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private templateService: TemplateService,
    private enumService: EnumService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {

    // ID from route
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.template = this.id ? this.activatedRoute.snapshot.data['record'] : new Template();

    // Get the lists
    this.enumService.getEnumValues('tr.core.enums.TrApplication').subscribe(responseData => {
      this.applications = responseData;
      this.getMainDatasets();
    });
    this.enumService.getEnumValues('tr.core.enums.TrEntity').subscribe(responseData => {
      this.entities = responseData;
    });

    if (this.id) {
      this.templateService.getDatasetTags(this.template.application, this.template.definition).subscribe(responseData => {
        this.templateDefinitionTagsList = JSON.stringify(responseData);
      });
    }

    // DoctorType
    this.enumService.getEnumValues('med.core.enums.DoctorType').subscribe(responseData => {
      this.doctorTypes = responseData;
    });

  }

  confirmExit(): boolean | Observable<boolean> {
    return this.templateForm.dirty;
  }

  saveTemplate() {

    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.templateService.saveTemplate(this.template).subscribe({
      next: (responseData: Template) => {
        this.toitsuToasterService.showSuccessStay();
        this.templateForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/template/view/', responseData.id]);
        } else {
          this.template = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  goToList() {
    this.router.navigate(['/sa/template/list']);
  }

  newRecord() {
    this.router.navigate(['/sa/template/view']);
  }
  
  // applicationChanged() {
  //   this.template.definition = null;
  //   this.getMainDatasets();
  // }

  getMainDatasets() {
    if (this.template.application) {
      this.templateService.getMainDatasets(this.template.application).subscribe(responseData => {
        
        this.templateDefinitions = responseData;

      });
    } else {
      this.templateDefinitions = [];
    }
  }

  templateDefinitionChanged() {
    
    this.getMainDatasets();

  }


  editorOptions = {
    language: 'el',
    allowedContent: true,
    extraAllowedContent: 'input[*]',
    extraPlugins: 'tableresize,tagdropdown,ajax,base64image,imagebrowser,placeholder,lineheight,condition,scayt', // caution on plugins declaring order
    removePlugins: 'format,colorbutton,language',
    removeButtons: 'Flash,Smiley,SpecialChar,Iframe,Save,Preview,Print,Templates,Form,Checkbox,Radio,Textarea,Select,Button,ImageButton,HiddenField,UIColor,Maximize,Link,Unlink,Anchor,About',
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
