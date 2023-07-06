import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DisciplineService} from './discipline.service';
import {DisciplinePenaltyService} from '../discipline-penalty/discipline-penalty.service';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {Discipline} from './discipline.model';
import {DisciplinePenalty} from '../discipline-penalty/discipline-penalty.model';
import {SelectDisciplinesToMergeDialogComponent} from './select-disciplines-to-merge/select-disciplines-to-merge-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {InmateService} from '../inmate/inmate.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {DisplayMergedDisciplinesDialogComponent} from './display-merged-disciplines/display-merged-disciplines-dialog.component';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {DisciplineOffenseService} from '../discipline-offense/discipline-offense.service';

@Component({
  selector: 'app-inm-discipline-view',
  templateUrl: 'discipline-view.component.html'
})

export class DisciplineViewComponent implements OnInit, ExitConfirmation {

  id: number;
  discipline: Discipline;
  @ViewChild(NgForm) disciplineForm: NgForm;
  disciplineTypeParams = {};
  disciplinePenaltyParams = {};
  disciplineBehaviorParams = {};
  disciplineDecisionAuthorityParams = {};
  mergingDisciplines = [];
  selectedMergingDisciplines = [];
  mergedDisciplines = [];
  inmates = [];
  inmateDialogUrl: string;
  mergingDiscipline: any = {};
  viewLink = '/inm/discipline/view';
  disciplineOffensesOfDiscipline: any = [];

  

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private disciplineService: DisciplineService,
    private disciplinePenaltyService: DisciplinePenaltyService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private disciplineOffenseService: DisciplineOffenseService

  ) {
  }

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.discipline = this.id ? this.route.snapshot.data['record'] : new Discipline();

    // Discipline Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_Type, [this.discipline.disciplineTypePid]).subscribe(responseData => {
      this.disciplineTypeParams = responseData;
    });

    // Discipline Penalties
    let disciplinePenaltyPids = [];
    if (this.discipline.disciplinePenalties) {
      this.discipline.disciplinePenalties.forEach(disciplinePenalty => {
        if (disciplinePenalty.penaltyTypePid) {
          disciplinePenaltyPids.push(disciplinePenalty.penaltyTypePid);
        }
      });
    }
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_PenaltyType,  disciplinePenaltyPids).subscribe(responseData => {
      this.disciplinePenaltyParams = responseData;
    });
    
    // Discipline Behaviors
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_Behavior,  [this.discipline.behaviorPid]).subscribe(responseData => {
      this.disciplineBehaviorParams = responseData;
    });

    // Discipline Decision Authorities
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_DecisionAuthority,  [this.discipline.decisionAuthorityPid]).subscribe(responseData => {
      this.disciplineDecisionAuthorityParams = responseData;
    });

    // Inmates
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // Get Related Discipline Data if Given Discipline is Merged
    if (this.discipline.merged === true) {
      this.disciplineService.getDiscipline(this.discipline.relatedDisciplineId).subscribe(response => {
        this.mergingDiscipline = response;
      });
    }
    
    // Ανάκτηση πειθαρχικών παραπτωμάτων με βάση το id πειθαρχικού
    if (this.discipline.id) {
      this.disciplineOffenseService.getDisciplineOffensesByDisciplineId(this.discipline.id).subscribe(response => {
        this.disciplineOffensesOfDiscipline = response;
      });
    }
    
    console.log(this.discipline);
    
  }
  
  
  confirmExit(): boolean | Observable<boolean> {
    return this.disciplineForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/discipline/view']);
  }

  goToList() {
    this.router.navigate(['/inm/discipline/list']);
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.discipline.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }
  

  // ΠΕΙΘΑΡΧΙΚΑ ---------------------------------------------------------------------------------------------------------------------------------------

  // Μέθοδος κλειδώματος πεδίων υπό συνθήκη 
  // Ελέγχει αν το πειθαρχικό δημιουργήθηκε από απόφαση πειθαρχικών στο συμβούλιο πειθαρχικών.
  lockIfDisciplineWasCreatedFromDisciplineCouncil(disciplineId): boolean {
    
    // Λίστα με τα ids πειθαρχικού των πειθαρχικών παραπτωμάτων. Αφορά μόνο τα πειθαρχικά παραπτώματα που χρησιμοποιήθηκαν για να δημιουργήσουν το πειθαρχικό από απόφαση πειθαρχικών στο συμβούλιο πειθαρχικών.
    const disciplineIdsOfDisciplineOffenses: number[] = this.disciplineOffensesOfDiscipline.map(disciplineOffenseOfDiscipline => disciplineOffenseOfDiscipline.disciplineId);
    
    // Λίστα με τα μοναδικά ids πειθαρχικού των πειθαρχικών παραπτωμάτων.
    const distinctDisciplineIdsOfDisciplineOffenses = [...new Set(disciplineIdsOfDisciplineOffenses)];
    
    // Αρχικοποίηση id πειθαρχικού των πειθαρχικών παραπτωμάτων
    let disciplineIdOfDisciplineOffenses: number;
    
    // Άν η λίστα με τα μοναδικά ids πειθαρχικού των πειθαρχικών παραπτωμάτων έχει μόνο ένα id πειθαρχικού
    if (distinctDisciplineIdsOfDisciplineOffenses.length === 1) {
      
      // Σετάρισμα id πειθαρχικού των πειθαρχικών παραπτωμάτων με το μοναδικό id πειθαρχικού της λίστας.
      disciplineIdOfDisciplineOffenses = distinctDisciplineIdsOfDisciplineOffenses[0];
      
      // Άν το id πειθαρχικού των πειθαρχικών παραπτωμάτων είναι ίδιο με δοθέν id πειθαρχικού
      if (disciplineIdOfDisciplineOffenses === disciplineId) {
        return true;
      } else {
        return false;
      }
      
    } else {
      return false;
    }
    
  }
  
  // Άνοιγμα dialog πειθαρχικών προς Συγχώνευση
  openMergingDisciplinesDialog() {
    if (this.discipline.inmateId == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.translate.instant('discipline.disciplinesToMerge.noInmateSelected')
      });
    } else {
      this.disciplineService.getDisciplinesToMerge(this.discipline.inmateId).subscribe(response => {
        this.mergingDisciplines = response;

        this.toitsuToasterService.clearMessages();
        const ref = this.dialogService.open(SelectDisciplinesToMergeDialogComponent, {
          header: this.translate.instant('discipline.selectDisciplinesToMerge.dialogTitle'),
          data: {
            mergingDisciplines: this.mergingDisciplines,
            selectedMergingDisciplines: this.selectedMergingDisciplines
          },
          closable: false,
        });

        ref.onClose.subscribe(result => {
          if (result) {
            this.selectedMergingDisciplines = result;

            this.discipline.selectedDisciplines = this.selectedMergingDisciplines.map(item => item.id);
          }
        });

      });
    }
  }

  // Άνοιγμα dialog συγχωνευμένων πειθαρχικών
  openMergedDisciplinesDialog() {
    this.disciplineService.getDisciplinesToUnmerge(this.discipline.id).subscribe(response => {
      this.mergedDisciplines = response;

      this.toitsuToasterService.clearMessages();
      const ref = this.dialogService.open(DisplayMergedDisciplinesDialogComponent, {
        header: this.translate.instant('discipline.displayMergedDisciplines.dialogTitle'),
        data: {
          mergedDisciplines: this.mergedDisciplines
        },
      });

      ref.onClose.subscribe(result => {
        if (result) {
          this.mergedDisciplines = result;

          this.discipline.selectedDisciplines = this.mergedDisciplines.map(item => item.id);
        }
      });

    });
  }
  
  // Αποθήκευση πειθαρχικού
  saveDiscipline() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineService.saveDiscipline(this.discipline).subscribe({
      next: (responseData: Discipline) => {
        this.toitsuToasterService.showSuccessStay();
        this.disciplineForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/discipline/view', responseData.id]);
        } else {
          this.discipline = responseData;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  // Διαγραφή πειθαρχικού
  deleteDiscipline() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.disciplineService.deleteDiscipline(this.discipline.id).subscribe({
          next: (responseData: Discipline) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.disciplineForm.form.markAsPristine();
            this.router.navigate(['/inm/discipline/list']);
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

  // Αποσυγχώνευση πειθαρχικού
  unmergeDiscipline() {
    this.confirmationService.confirm({
      message: this.translate.instant('discipline.view.unmerge.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.disciplineService.unmergeDiscipline(this.discipline).subscribe({
          next: (responseData: Discipline) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('discipline.view.unmerge.success'));
            this.disciplineForm.form.markAsPristine();
            this.discipline = responseData;
            this.changeDetectorRef.detectChanges();
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

  // ΠΟΙΝΕΣ ΠΕΙΘΑΡΧΙΚΟΥ ---------------------------------------------------------------------------------------------------------------------------------------

  // Προσθήκη ποινής πειθαρχικού
  addDisciplinePenalty() {
    let disciplinePenalty = new DisciplinePenalty();
    this.discipline.disciplinePenalties.push(disciplinePenalty);
    this.changeDetectorRef.detectChanges();
  }

  // Διαγραφή ποινής πειθαρχικού
  deleteDisciplinePenalty(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.discipline.disciplinePenalties.splice(index, 1);
          this.changeDetectorRef.detectChanges();
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.disciplinePenaltyService.deleteDisciplinePenalty(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.discipline.disciplinePenalties.splice(index, 1);
              this.changeDetectorRef.detectChanges();
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
