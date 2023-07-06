import {Component, OnInit, ViewChild} from '@angular/core';
import {Program} from './program.model';
import {ProgramType} from '../../sa/program-type/program-type.model';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {ProgramTypeService} from '../../sa/program-type/program-type.service';
import {ProgramService} from './program.service';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {ProgramApplicationWithdrawalDetailsDialogComponent} from '../program-application/program-application-withdrawal-details-dialog/program-application-withdrawal-details-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {ProgramApplicationService} from '../program-application/program-application.service';
import {ProgramApplicationListDialogComponent} from '../program-application/program-application-list-dialog/program-application-list-dialog.component';
import {ProfessionService} from '../../sa/profession/profession.service';

@Component({
  selector: 'app-inm-program-conduct-view',
  templateUrl: 'program-conduct-view.component.html'
})
export class ProgramConductViewComponent implements OnInit {

  id: number;
  programTypes = [];
  statuses = [];
  program: Program;
  certification;
  programType: ProgramType;
  selectedProgramApplications = [];
  programApplicationIdsToExclude = [];

  @ViewChild(NgForm) programForm: NgForm;
  professions = [];


  constructor(private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              private toitsuSharedService: ToitsuSharedService,
              public authService: AuthService,
              private dateService: DateService,
              private programTypeService: ProgramTypeService,
              private programService: ProgramService,
              private toitsuTableService: ToitsuTableService,
              private enumService: EnumService,
              private dialogService: DialogService,
              private programApplicationService: ProgramApplicationService,
              private professionService: ProfessionService
  ) {}

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];
    // Get the record from the activatedRoute resolver or initialize a new one
    this.program = this.id ? this.activatedRoute.snapshot.data['record'] : new Program();

    if (this.program.status === 'PENDING') {
      this.router.navigate(['/inm/program/conduct/list']);
    }


    this.programTypeService.getAllProgramTypes(true, [this.program.programTypeId]).subscribe({
      next: (responseData) => {
        this.programTypes = responseData;
      }
    });
    // Status
    this.enumService.getEnumValues('inm.core.enums.ProgramStatus').subscribe(responseData => {
      this.statuses = responseData;
      // .filter(item => item['value'] !== 'PENDING');
    });

    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([this.program.professionId]).subscribe(responseData => {
      this.professions = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.programForm.dirty;
  }

  goToList() {
    this.router.navigate(['/inm/program/conduct/list']);
  }

  saveProgramConduct() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    this.program.programApplications.forEach(programApplication => {
      if (!(programApplication.lateEntry)) {
        programApplication.startDate = this.program.startDate;
      }
    });
    this.programService.saveProgram(this.program).subscribe({
      next: (responseData: Program) => {
        this.toitsuToasterService.showSuccessStay();
        this.programForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/program/conduct/view', responseData.id]);
        } else {
          this.program = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.program.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }

  openWithdrawalDetails(index) {

    this.toitsuToasterService.clearMessages();
    const programApplicationWithdrawalDetailsDialog = this.dialogService.open(ProgramApplicationWithdrawalDetailsDialogComponent, {
      header: this.translate.instant('programApplication.rejectionDetails'),
      width: '50rem',
      height: '30rem',
      data:
        {
          withdrawal: this.program.programApplications[index].withdrawal,
          withdrawalReasonPid: this.program.programApplications[index].withdrawalReasonPid,
          endDate: this.program.programApplications[index].endDate,
          withdrawalComments: this.program.programApplications[index].withdrawalComments,
          programStatus: this.program.status,
          dcId: this.program.dcId
        },
      closable: false
    });
    programApplicationWithdrawalDetailsDialog.onClose.subscribe(result => {

      if (result) {
        this.program.programApplications[index].withdrawal = result[0].withdrawal;
        this.program.programApplications[index].withdrawalReasonPid = result[0].withdrawalReasonPid;
        this.program.programApplications[index].endDate = result[0].endDate;
        this.program.programApplications[index].withdrawalComments = result[0].withdrawalComments;

        if (result[1] === true) {
          this.programForm.form.markAsDirty();
        }
      }
    });
  }

  completeProgram() {
    this.confirmationService.confirm({
      message: this.translate.instant('programConduct.complete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.program.status = 'COMPLETED';
        this.program.programApplications.forEach(programApplication => {
          if (!programApplication.withdrawal) {
            programApplication.endDate = this.program.endDate;
          }
        });
        this.programService.saveProgram(this.program).subscribe({
          next: (responseData: Program) => {

            this.toitsuToasterService.showSuccessStay();
            this.programForm.form.markAsPristine();
            this.program = responseData;
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

  lockedApplications() {

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.program.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }

  selectLateApplicationsDialog() {
    this.program.programApplications.forEach(programApplication => {
      this.programApplicationIdsToExclude.push(programApplication.id);
    });

    this.toitsuToasterService.clearMessages();
    const programApplicationListDialog = this.dialogService.open(ProgramApplicationListDialogComponent, {
      header: this.translate.instant('programApplication.select.dialogTitle'),
      width: '95%',
      data: {
        programId: this.program.id,
        programApplicationIdsToExclude: this.programApplicationIdsToExclude
      }
    });
    programApplicationListDialog.onClose.subscribe(result => {
      this.selectedProgramApplications = [];
      this.programApplicationIdsToExclude = [];
      if (result) {
        result.filter(programApplication => {
          this.selectedProgramApplications.push(programApplication);
        });
      }

      this.selectedProgramApplications.forEach(retrievedProgramApplication => {
        let programApplication;
        this.programApplicationService.getProgramApplication(retrievedProgramApplication.id).subscribe(responseData => {
          programApplication = responseData;
          if (this.program.programApplications.filter(application => application.id === programApplication.id).length === 0) {
            programApplication.lateEntry = true;
            this.program.programApplications.push(programApplication);
          }
        });
      });
    });
  }
}
