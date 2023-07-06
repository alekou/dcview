import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {ProgramApplicationService} from './program-application.service';
import {ProgramApplication} from './program-application.model';
import {ProgramService} from '../program/program.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {ProfessionService} from '../../sa/profession/profession.service';

@Component({
  selector: 'app-inm-program-application-view',
  templateUrl: 'program-application-view.component.html'
})
export class ProgramApplicationViewComponent implements OnInit {
  id: number;
  programApplication: ProgramApplication;
  inmateDialogUrl = inmateConsts.activeIndexUrl;
  programs = [];
  // program;
  professions = [];
  isSchool = false;
  isCertifiedCourse = false;
  pWithdrawalReasons = {};
  
  @ViewChild(NgForm) programApplicationForm: NgForm;


  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private genParameterTypeService: GenParameterTypeService,
    private programApplicationService: ProgramApplicationService,
    private programService: ProgramService,
    private professionService: ProfessionService
  ) {}

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];

    // Get the record from the activatedRoute resolver or initialize a new one
    this.programApplication = this.id ? this.activatedRoute.snapshot.data['record'] : new ProgramApplication();
    
    // Φόρτωση λίστας προγραμμάτων σε αναμονή έγκρισης
    this.programService.getPrograms([this.programApplication.programId]).subscribe(responseData => {
      this.programs = responseData;
    });
    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([this.programApplication.professionId]).subscribe(responseData => {
      this.professions = responseData;
    });

    // Withdrawal Reasons
    this.genParameterTypeService.getByCategory(GenParameterCategory.ProgramApplication_WithdrawalReason, [this.programApplication.withdrawalReasonPid]).subscribe((responseData: GenParameterType) => {
      this.pWithdrawalReasons = responseData;
    });
    
    // Get Profession, Program and ProgramType for the Checkbox Conditions
    if (this.id) {
      if (this.programApplication.program.programType.kind === 'SCHOOL') {
        this.isSchool = true;
      } else if (this.programApplication.program.programType.kind === 'COURSE') {
        if (this.programApplication.program.certification) {
          this.isCertifiedCourse = true;
        }
      }
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.programApplicationForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/programapplication/view']);
  }

  goToList() {
    this.router.navigate(['/inm/programapplication/list']);
  }

  saveProgramApplication() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.programApplicationService.saveProgramApplication(this.programApplication).subscribe({
      next: (responseData: ProgramApplication) => {
        this.toitsuToasterService.showSuccessStay();
        this.programApplicationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/programapplication/view', responseData.id]);
        } else {
          this.programApplication = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteProgramApplication() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.programApplicationService.deleteProgramApplication(this.programApplication.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.programApplicationForm.form.markAsPristine();
            this.router.navigate(['/inm/programapplication/list']);
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
    if (this.programApplication.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    // Εγγραφή που υπάρχει σε πρακτικό
    if (this.programApplication.protocolId != null) {
      return true;
    }
    // Εγγραφή που είναι εκπρόθεση σε εγκεκριμένο πρόγραμμα σχολείου
    if (this.programApplication.lateEntry === true) {
      return true;
    }
  }

  /**
   * Διαχείριση της θέσης εργασίας βάσει επιλεγμένου προγράμματος
   */
  getProgramProfession(selectedProgram) {
    this.programApplication.professionId = selectedProgram.professionId ? selectedProgram.professionId : null;
  }
  programChanged(programId) {
    this.programApplication.professionId = null;
    const selectedProgram = this.programs.find(program => program.id === programId);
    this.getProgramProfession(selectedProgram);
  }
}
