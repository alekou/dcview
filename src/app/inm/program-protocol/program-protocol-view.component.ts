import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {Observable} from 'rxjs';
import {ProgramService} from '../program/program.service';
import {ProgramProtocol} from './program-protocol.model';
import {ProgramProtocolService} from './program-protocol.service';
import {DialogService} from 'primeng/dynamicdialog';
import {ProgramApplicationListDialogComponent} from '../program-application/program-application-list-dialog/program-application-list-dialog.component';
import {ProgramApplicationService} from '../program-application/program-application.service';
import {ProgramApplicationRejectionDetailsDialogComponent} from '../program-application/program-application-rejection-details-dialog/program-application-rejection-details-dialog.component';
import {Program} from '../program/program.model';
import {ProgramApplication} from '../program-application/program-application.model';
import {HttpErrorResponse} from '@angular/common/http';
import {ProfessionService} from '../../sa/profession/profession.service';

@Component({
  selector: 'app-inm-program-protocol-view',
  templateUrl: 'program-protocol-view.component.html'
})
export class ProgramProtocolViewComponent implements OnInit {
  id: number;
  programProtocol: ProgramProtocol;
  programs = [];
  programApplicationsActiveIndex = -1;
  professions = [];
  selectedProgram: Program;
  loading = false;
  approveStatus: boolean = null;

  @ViewChild(NgForm) programProtocolForm: NgForm;

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private dateService: DateService,
    private programProtocolService: ProgramProtocolService,
    private programService: ProgramService,
    private dialogService: DialogService,
    private programApplicationService: ProgramApplicationService,
    private professionService: ProfessionService
  ) {}

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];
    // Get the record from the activatedRoute resolver or initialize a new one
    this.programProtocol = this.id ? this.activatedRoute.snapshot.data['record'] : new ProgramProtocol();

    this.programService.getPrograms([this.programProtocol.programId]).subscribe(responseData => {
      this.programs = responseData;
    });

    if (this.id) {
      this.programService.getProgram(this.programProtocol.programId).subscribe((programResponse: Program) => {
        this.selectedProgram = programResponse;
      });
    }
    
    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([]).subscribe(responseData => {
      this.professions = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.programProtocolForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/programprotocol/view']);
  }

  goToList() {
    this.router.navigate(['/inm/programprotocol/list']);
  }

  saveProgramProtocol() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    this.programProtocolService.saveProgramProtocol(this.programProtocol).subscribe({
      next: (responseData: ProgramProtocol) => {
        this.toitsuToasterService.showSuccessStay();
        this.programProtocolForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/programprotocol/view', responseData.id]);
        } else {
          this.programProtocol = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
        // Αν δε γίνει αποθήκευση, επιστροφή στην αρχική κατάσταση έγκρισης
        if (this.approveStatus !== this.programProtocol.approved) {
          this.programProtocol.approved = this.approveStatus;
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      this.loading = false;
    });
  }

  deleteProgramProtocol() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.programProtocolService.deleteProgramProtocol(this.programProtocol.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.programProtocolForm.form.markAsPristine();
            this.router.navigate(['/inm/programprotocol/list']);
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

  // Επιλογή Αιτήσεων----------------------------------------------------------------------------------
  selectedProgramApplications = [];
  programApplicationIdsToExclude = [];

  openProgramApplicationsListDialog() {
    if (this.programProtocol.programId == null) {
      this.toitsuToasterService.showInfoStay(this.translate.instant('programProtocol.programIdNull'));
    } else {
      this.programProtocol.programApplications.forEach(programApplication => {
        this.programApplicationIdsToExclude.push(programApplication.id);
      });
      this.toitsuToasterService.clearMessages();
      const programApplicationListDialog = this.dialogService.open(ProgramApplicationListDialogComponent, {
        header: this.translate.instant('programApplication.select.dialogTitle'),
        width: '95%',
        data: {
          programId: this.programProtocol.programId,
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
            if (this.programProtocol.programApplications.filter(application => application.id === programApplication.id).length === 0) {
              this.programProtocol.programApplications.push(programApplication);
            }
          });
        });
      });
    }
  }

  openProgramApplicationRejectionDetailsDialog(index) {

    this.toitsuToasterService.clearMessages();
    const programApplicationRejectionDetails = this.dialogService.open(ProgramApplicationRejectionDetailsDialogComponent, {
      header: this.translate.instant('programApplication.rejectionDetails'),
      width: '50rem',
      height: '30rem',
      data:
        {
          rejected: this.programProtocol.programApplications[index].rejected,
          rejectedDate: this.programProtocol.programApplications[index].rejectedDate,
          rejectedComments: this.programProtocol.programApplications[index].rejectedComments,
          dcId: this.programProtocol.dcId,
          protocolApproved: this.programProtocol.approved
        },
      closable: false
    });
    programApplicationRejectionDetails.onClose.subscribe(result => {

      if (result) {
        this.programProtocol.programApplications[index].rejected = result[0].rejected;
        this.programProtocol.programApplications[index].rejectedDate = result[0].rejectedDate;
        this.programProtocol.programApplications[index].rejectedComments = result[0].rejectedComments;

        if (result[1] === true) {
          this.programProtocolForm.form.markAsDirty();
        }
      }
    });
  }

  removeProgramApplication(index, protocolId) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!protocolId) {
          this.programProtocol.programApplications.splice(index, 1);
          this.programApplicationsActiveIndex = -1;
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.programApplicationService.detachProgramApplication(this.programProtocol.programApplications[index].id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.programProtocol.programApplications.splice(index, 1);
              this.programApplicationsActiveIndex = -1;
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

  programChanged() {
    this.programProtocol.programApplications.forEach(programApplication => {
      programApplication.protocolId = null;
      this.programApplicationService.saveProgramApplication(programApplication).subscribe({
        next: (responseData: ProgramApplication) => {
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
    });
    const foundCurrentProgram = this.programs.find((result) => {
      return result.id === this.programProtocol.programId;
    });
    if (foundCurrentProgram) {
      this.selectedProgram = foundCurrentProgram;
    }
  }

  approvalChanged() {
    if (this.programProtocol.approved) {
      this.programProtocol.approvalDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.programProtocol.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }

  lockedApplications() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.programProtocol.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    // Εγκεκριμένο Πρακτικό - κλειδωμένη
    if (this.programProtocol.approved) {
      return true;
    }
  }

  approveProtocol() {
    this.confirmationService.confirm({
      message: this.translate.instant('programProtocol.approve.confirmation'),
      accept: () => {
        this.loading = true;
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        this.programProtocol.approved = true;
        this.programProtocolService.saveProgramProtocol(this.programProtocol).subscribe({
          next: (responseData: ProgramProtocol) => {
      
            this.programProtocolForm.form.markAsPristine();
            this.programProtocol = responseData;
            this.programProtocol.programApplications.forEach(programApplication => {
              if (!programApplication.rejected) {
                programApplication.startDate = this.selectedProgram.startDate;
                programApplication.endDate = this.selectedProgram.endDate;
              } else if (programApplication.rejected){
                programApplication.startDate = null;
                programApplication.endDate = null;
              }
            });
            this.toitsuToasterService.showSuccessStay();
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
          this.loading = false;
        });
      }
    });
  }
  calculateNotRejectedProgramApplications() {
    let noRejectedInmateLaborApplicationsCounter = 0;

    this.programProtocol.programApplications.forEach(value => {
      if (!value.rejected) {
        noRejectedInmateLaborApplicationsCounter++;
      }
    });
    return noRejectedInmateLaborApplicationsCounter;
  }
  composeAndDisplayInfoMessages(responseData, notRejectedInmateLaborApplicationsCounter) {
    // Μηνύματα
    let notCreatedInmateLabors = [];
    let createdInmateLaborsMessage = '';
    let notCreatedInmateLaborsMessage = '';
    let rejectedInmateLaborApplicationsMessage = '';

    // Μήνυμα αν υπάρχουν ήδη ενεργές εργασίες για τα αιτήματα του πρακτικού συμμετοχής
    if (responseData[1] > 0) {
      createdInmateLaborsMessage = this.translate.instant('programProtocol.createInmateLabors.created') +
        ` ${responseData[0]} ` + this.translate.instant('programProtocol.createInmateLabors.success') + '<br>' ;
      rejectedInmateLaborApplicationsMessage = '<br>' + this.translate.instant('programProtocol.createInmateLabors.info.applicationsRejected')
        + ': ' + (this.programProtocol.programApplications.length - notRejectedInmateLaborApplicationsCounter) + '<br>';
      notCreatedInmateLaborsMessage = '<br>' + this.translate.instant('programProtocol.createInmateLabors.notCreatedInmateLabors')  + '<br>';
      responseData[2].forEach(value => {
        this.programProtocol.programApplications.forEach(programApplication => {
          if (this.programProtocol.programApplications.indexOf(programApplication) === value) {
            notCreatedInmateLabors.push(value + 1, ' ' + programApplication['inmateFullName']);
          }
        });
      });
      for (let i = 0; i < notCreatedInmateLabors.length; i++) {
        if (i < notCreatedInmateLabors.length - 1 && (i + 1) % 2 !== 0) {
          notCreatedInmateLaborsMessage += '[' + this.translate.instant('programProtocol.createInmateLabors.programApplication') + ' ';
        }
        notCreatedInmateLaborsMessage += notCreatedInmateLabors[i];
        if (i < notCreatedInmateLabors.length - 1 && (i + 1) % 2 !== 0) {
          notCreatedInmateLaborsMessage += '] ';
        }
        if (i < notCreatedInmateLabors.length - 1 && (i + 1) % 2 === 0) {
          notCreatedInmateLaborsMessage += '<br>';
        }
        if (i === notCreatedInmateLabors.length - 1) {
          notCreatedInmateLaborsMessage += '<br>';
        }
      }
      this.toitsuToasterService.showInfoStay(createdInmateLaborsMessage + notCreatedInmateLaborsMessage + rejectedInmateLaborApplicationsMessage);
    }

    // Μήνυμα αν δημιουργήθηκαν εργασίες για όλα τα αιτήματα εργασίας και δεν υπάρχουν αιτήματα που απορρίφθηκαν
    if ((this.programProtocol.programApplications.length === notRejectedInmateLaborApplicationsCounter) && responseData[1] === 0) {
      this.toitsuToasterService.showSuccessStay(this.translate.instant('programProtocol.createInmateLabors.allInmateLaborsCreated.success'));
    }

    // Μήνυμα αν δημιουργήθηκαν εργασίες για όλα τα αιτήματα εργασίας και υπάρχουν αιτήματα που απορρίφθηκαν
    if ((this.programProtocol.programApplications.length !== notRejectedInmateLaborApplicationsCounter) && responseData[1] === 0) {
      createdInmateLaborsMessage = this.translate.instant('programProtocol.createInmateLabors.created') +
        ` ${responseData[0]} ` + this.translate.instant('programProtocol.createInmateLabors.success') + '<br>' ;
      rejectedInmateLaborApplicationsMessage = '<br>' + this.translate.instant('programProtocol.createInmateLabors.info.applicationsRejected')
        + ': ' + (this.programProtocol.programApplications.length - notRejectedInmateLaborApplicationsCounter) + '<br>';
      this.toitsuToasterService.showInfoStay(createdInmateLaborsMessage + rejectedInmateLaborApplicationsMessage);
    }

    // Μήνυμα αν όλα τα αιτήματα εργασίας έχουν απορριφθεί
    if (notRejectedInmateLaborApplicationsCounter === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('programProtocol.createInmateLabors.info.allApplicationsRejected'));
    }
  }

  createInmateLabors() {
    this.confirmationService.confirm({
      message: this.translate.instant('programProtocol.createInmateLabors.confirmation'),
      accept: () => {
        this.loading = true;
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        // Μέτρηση μη απορριφθέντων αιτημάτων εργασίας
        let notRejectedInmateLaborApplicationsCounter = this.calculateNotRejectedProgramApplications();
        this.programProtocolService.createInmateLabors(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay();
            this.programProtocolForm.form.markAsPristine();
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
          this.loading = false;
        });
      }
    });
  }
}

