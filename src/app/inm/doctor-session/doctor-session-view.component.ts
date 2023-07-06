import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {inmateConsts} from '../inmate/inmate.consts';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DoctorSession} from './doctor-session.model';
import {DoctorSessionService} from './doctor-session.service';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {SessionTypeService} from '../../sa/session-type/session-type.service';
import {TemplateListDialogComponent} from '../../sa/template/template-list-dialog/template-list-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {Report} from '../../sa/report/report.model';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';

@Component({
  standalone: true,
  selector: 'app-inm-doctor-session-view',
  imports: [ToitsuSharedModule, GeneralSharedModule],
  templateUrl: 'doctor-session-view.component.html'
})
export class DoctorSessionViewComponent implements OnInit, ExitConfirmation {

  subsystem: string;
  @ViewChild(NgForm) doctorSessionForm: NgForm;
  doctorSession: DoctorSession;
  id: number;
  doctorType: string;
  doctors = [];
  inmateDialogUrl = inmateConsts.activeIndexUrl;
  sessionTypes = [];
  


  constructor(private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              public authService: AuthService,
              private doctorSessionService: DoctorSessionService,
              private doctorService: DoctorService,
              private sessionTypeService: SessionTypeService,
              private dialogService: DialogService
  ) {
    this.doctorType = this.activatedRoute.snapshot.pathFromRoot[4].routeConfig.path;
    this.subsystem = this.activatedRoute.snapshot.pathFromRoot[1].routeConfig.path;
  }

  ngOnInit(): void {

    // Get the id from the route
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.doctorSession = this.id ? this.activatedRoute.snapshot.data['record'] : new DoctorSession();
    if (!this.id){
      this.doctorSession.doctorType = this.doctorType.toUpperCase();
    } else if (this.id){
      this.doctorType = this.doctorSession.doctorType.toLowerCase();
      if (this.activatedRoute.snapshot.pathFromRoot[4].routeConfig.path.toUpperCase() !== this.doctorSession.doctorType){
        this.router.navigate(['/']); // Redirect to the 403 page
      }
    }

    this.doctorSessionService.authorizeDoctor(this.doctorType.toUpperCase()).subscribe(
      hasPermission => {
        if (!hasPermission) {
          this.router.navigate(['/403']); // Redirect to the 403 page
        }
      }
    );

    this.doctorService.  getActiveDoctorsByUserAndDoctorType(this.doctorType.toUpperCase()).subscribe({
      next: (responseData) => {
        this.doctors = responseData;
      }
    });

    this.sessionTypeService.getSessionTypesByDoctorType(this.doctorType.toUpperCase()).subscribe({
      next: (responseData) => {
        this.sessionTypes = responseData;
      }
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.doctorSessionForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/' + this.subsystem + '/doctorsession/' + this.doctorType + '/view']);
  }

  goToList() {
    this.router.navigate(['/' + this.subsystem + '/doctorsession/' + this.doctorType + '/list']);
  }

  saveDoctorSession() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.doctorSessionService.saveDoctorSession(this.doctorSession).subscribe({
      next: (responseData: DoctorSession) => {
        this.toitsuToasterService.showSuccessStay();
        this.doctorSessionForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/' + this.subsystem + '/doctorsession/' + this.doctorType.toLowerCase() + '/view', responseData.id]);
        } else {
          this.doctorSession = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteDoctorSession() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.doctorSessionService.deleteDoctorSession(this.doctorSession.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.doctorSessionForm.form.markAsPristine();
            this.router.navigate(['/' + this.subsystem + '/doctorsession/' + this.doctorType + '/list']);
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.doctorSession.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }
  
  clearReport() {
    if (this.doctorSession.report.content !== null) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.delete.confirmation'),
        accept: () => {
          this.doctorSession.report.content = null;
        }
      });
    }

  }

  openTemplateList() {
    if (this.doctorSession.report.content !== null) {
      this.confirmationService.confirm({
        message: this.translate.instant('doctorSession.view.replaceReport'),
        accept: () => {

          this.toitsuToasterService.clearMessages();
          const dialogRef = this.dialogService.open(TemplateListDialogComponent, {
            header: this.translate.instant('template.select.dialogTitle'),
            width: '95%',
            data: {
              hideTab: true,
              entity: 'INMATEFOLDER',
              entityId: this.doctorSession.inmateId,
              application: 'INM',
              doctorType: this.doctorType.toUpperCase()
            },
          });


          dialogRef.onClose.subscribe((result) => {
            if (result) {
              if (!result.report) {
                let application = 'INM';
                let templateId = result.id;
                let entity = 'INMATEFOLDER';
                let entityId = this.doctorSession.inmateId;
                let entityIdColName = 'inmateFolderId';

                this.doctorSessionService.addTemplateReportToDoctorSession(this.doctorSession, templateId, entityId).subscribe({
                  next: (responseData: Report) => {
                    this.doctorSession.report = responseData;
                  }
                });

              }
            }
          });
        }
      });
    } 
    else{
      this.toitsuToasterService.clearMessages();
      
      const dialogRef = this.dialogService.open(TemplateListDialogComponent, {
        header: this.translate.instant('template.select.dialogTitle'),
        width: '95%',
        data: {
          hideTab: true,
          entity: 'INMATEFOLDER',
          entityId: this.doctorSession.inmateId,
          application: 'INM',
          doctorType: this.doctorType.toUpperCase()
        },
      });
      dialogRef.onClose.subscribe((result) => {
        if (result) {
          if (!result.report) {
            let application = 'INM';
            let templateId = result.id;
            let entity = 'INMATEFOLDER';
            let entityId = this.doctorSession.inmateId;
            let entityIdColName = 'inmateFolderId';

            this.doctorSessionService.addTemplateReportToDoctorSession(this.doctorSession, templateId, entityId).subscribe({
              next: (responseData: Report) => {
                this.doctorSession.report = responseData;
              }
            });
          }
        }
      });
    }
  }
  
  openReport() {
    this.router.navigate(['/inm/report/view', this.doctorSession.report.id]);
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
