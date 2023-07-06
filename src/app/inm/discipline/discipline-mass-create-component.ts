import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {Discipline} from './discipline.model';
import {NgForm} from '@angular/forms';
import {inmateConsts} from '../inmate/inmate.consts';
import {Observable} from 'rxjs';
import {InmateService} from '../inmate/inmate.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DisciplineService} from './discipline.service';
import {DisciplinePenalty} from '../discipline-penalty/discipline-penalty.model';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-inm-discipline-mass-create',
  templateUrl: 'discipline-mass-create-component.html'
})
export class DisciplineMassCreateComponent implements OnInit {
  
  discipline: Discipline = new Discipline();
  @ViewChild(NgForm) massCreateDisciplineForm: NgForm;
  disciplineTypeParams = {};
  disciplinePenaltyParams = {};
  disciplineDecisionAuthorityParams = {};
  inmates = [];
  inmateDialogUrl: string;
  disciplinesToSave: Discipline[] = [];



  constructor(
    private translate: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private genParameterTypeService: GenParameterTypeService,
    private inmateService: InmateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private disciplineService: DisciplineService


  ) {
  }
  
  ngOnInit(): void {
    
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

    // Discipline Decision Authorities
    this.genParameterTypeService.getByCategory(GenParameterCategory.Discipline_DecisionAuthority,  [this.discipline.decisionAuthorityPid]).subscribe(responseData => {
      this.disciplineDecisionAuthorityParams = responseData;
    });

    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  
    
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.massCreateDisciplineForm.dirty;
  }
  
  goToList() {
    this.router.navigate(['/inm/discipline/list']);
  }

  // Νέα εγγραφή μεταβλητού πειθαρχικού
  newRecord() {
    // Νεό πειθαρχικό
    let discipline = new Discipline();
    // Εισαγωγή νέου πειθαρχικού στην λίστα πειθαρχικών προς αποθήκευση
    this.disciplinesToSave.push(discipline);

    // Δείκτης τελευταίας εγγραφής της λίστας πειθαρχικών προς αποθήκευση
    const lastIndex = this.disciplinesToSave.length - 1;

    // Νέα ποινή πειθαρχικού
    let disciplinePenalty = new DisciplinePenalty();
    // Εισαγωγή νέας ποινής πειθαρχικού στην λίστα ποινών πειθαρχικού, του πειθαρχικού προς αποθήκευση που έχει τον δείκτη της τελευταίας εγγραφής
    this.disciplinesToSave[lastIndex].disciplinePenalties.push(disciplinePenalty);
  }

  // Αφαίρεση μεταβλητού πειθαρχικού από τον πίνακα (p-table) "Μεταβλητές Πειθαρχικών" 
  removeDisciplineFromList(index) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.disciplinesToSave.splice(index,  1);
      }
    });
    
  }
  
  // Εισαγωγή κοινών στοιχείων στα πειθαρχικά προς αποθήκευση
  addSharedDataToDisciplinesToSave(){
    
    // Για κάθε πειθαρχικό προς αποθήκευση
    this.disciplinesToSave.forEach(disciplineToSave => {
      
      // Ορισμός τύπου πειθαρχικού
      disciplineToSave.disciplineTypePid = this.discipline.disciplineTypePid;
      // Ορισμός αριθμού απόφασης
      disciplineToSave.decisionNo = this.discipline.decisionNo;
      // Ορισμός ημερομηνίας απόφασης
      disciplineToSave.decisionDate = this.discipline.decisionDate;
      // Ορισμός εκδοτικής αρχής
      disciplineToSave.decisionAuthorityPid = this.discipline.decisionAuthorityPid;
      
    });
    
  }
  
  // Μαζική δημιουργία πειθαρχικών
  massDisciplineCreate() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    // Εισαγωγή κοινών στοιχείων στα πειθαρχικά προς αποθήκευση
    this.addSharedDataToDisciplinesToSave();
    
    this.disciplineService.massCreateDisciplines(this.disciplinesToSave).subscribe({
      next: (responseData: Discipline[]) => {
        this.toitsuToasterService.showSuccessStay();
        this.massCreateDisciplineForm.form.markAsPristine();
        this.router.navigate(['/inm/discipline/list']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
}
