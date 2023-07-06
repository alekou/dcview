import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {InmateService} from '../inmate/inmate.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {VisitProgramService} from './visit-program.service';
import {VisitProgram} from './visit-program.model';
import {EnumService} from '../../cm/enum/enum.service';
import {VisitProgramTimeFrame} from '../visit-program-time-frame/visit-program-time-frame.model';
import {VisitProgramTimeFrameService} from '../visit-program-time-frame/visit-program-time-frame.service';
import {AreaService} from '../area/area.service';
import {VisitProgramDetails} from '../visit-program-details/visit-program-time-frame.model';
import {VisitTypeService} from '../../sa/visit-type/visit-type.service';
import {VisitProgramDetailsService} from '../visit-program-details/visit-program-time-frame.service';

@Component({
  selector: 'app-inm-visit-program-view',
  templateUrl: 'visit-program-view.component.html'
})
export class VisitProgramViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  visitProgram: VisitProgram;
  @ViewChild(NgForm) visitProgramForm: NgForm;
  
  inmates = [];
  inmateDialogUrl: string;
  weekdays = [];
  visitTypes = [];
  areasWithoutPositions = [];
  
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private visitProgramTimeFrameService: VisitProgramTimeFrameService,
    private visitProgramDetailsService: VisitProgramDetailsService,
    private inmateService: InmateService,
    private enumService: EnumService,
    private visitProgramService: VisitProgramService,
    private areaService: AreaService, 
    private visitTypeService: VisitTypeService
  )  {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.visitProgram = this.id ? this.route.snapshot.data['record'] : new VisitProgram();
    
    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // Weakdays
    this.enumService.getEnumValues('cm.core.enums.WeekEnum').subscribe(responseData => {
      this.weekdays = responseData;
    });

    // Φόρτωση όλων των Περιοχών 
    this.areaService.getAreasWithoutPositions().subscribe({
      next: (responseData) => {
        if (responseData) {
          this.areasWithoutPositions = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    });

    // Φόρτωση όλων των VisitTypes
    this.visitTypeService.getAllVisitTypes().subscribe({
      next: (responseData) => {
        if (responseData) {
          this.visitTypes = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    });
    
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.visitProgramForm.dirty;
  }
  
  newRecord() {
    this.router.navigate(['/inm/visitprogram/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/visitprogram/list']);
  }

  saveVisitProgram() {
    
    
    console.log(this.visitProgram);
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.visitProgramService.saveVisitProgram(this.visitProgram).subscribe({
      next: (responseData: VisitProgram) => {
        this.toitsuToasterService.showSuccessStay();
        this.visitProgramForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/visitprogram/view', responseData.id]);
        } else {
          this.visitProgram = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVisitProgram() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.visitProgramService.deleteVisitProgram(this.visitProgram.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.visitProgramForm.form.markAsPristine();
            this.router.navigate(['/inm/visitprogram/list']);
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
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // VisitProgramTimeFrames
  addVisitProgramTimeFrame() {
    let visitProgramTimeFrame = new VisitProgramTimeFrame();
    this.visitProgram.visitProgramTimeFrames.push(visitProgramTimeFrame);
  }

  deleteVisitProgramTimeFrame(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitProgram.visitProgramTimeFrames.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.visitProgramTimeFrameService.deleteVisitProgramTimeFrame(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitProgram.visitProgramTimeFrames.splice(index, 1);
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // VisitProgramDetails

  addVisitProgramDetails() {
    let visitProgramDetails = new VisitProgramDetails();
    this.visitProgram.visitProgramDetails.push(visitProgramDetails);
  }

  deleteVisitProgramDetails(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visitProgram.visitProgramDetails.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.visitProgramDetailsService.deleteVisitProgramDetails(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visitProgram.visitProgramDetails.splice(index, 1);
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }
}
