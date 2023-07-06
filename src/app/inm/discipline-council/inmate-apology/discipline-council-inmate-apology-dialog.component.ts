import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {NgForm} from '@angular/forms';
import {ProgramApplication} from '../../program-application/program-application.model';
import {DisciplineOffense} from '../../discipline-offense/discipline-offense.model';
import {DisciplineOffenseService} from '../../discipline-offense/discipline-offense.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DisciplineCouncil} from '../discipline-council.model';

@Component({
  selector: 'app-inm-discipline-council-inmate-apology-dialog',
  templateUrl: 'discipline-council-inmate-apology-dialog.component.html'
})
export class DisciplineCouncilInmateApologyDialogComponent implements OnInit {
  
  @ViewChild(NgForm) disciplineCouncilInmateApologyForm: NgForm;
  dirtyForm: boolean = false;
  lastApology: string = null;
  disciplineOffense: DisciplineOffense = new DisciplineOffense();
  disciplineCouncil: DisciplineCouncil = new DisciplineCouncil();


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private toitsuToasterService: ToitsuToasterService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public disciplineOffenseService: DisciplineOffenseService
  ) {
  }

  ngOnInit() {
    this.disciplineOffense = this.dynamicDialogConfig.data.disciplineOffense;
    
    this.lastApology = this.dynamicDialogConfig.data.disciplineOffense.apology;
    
    this.disciplineCouncil = this.dynamicDialogConfig.data.disciplineCouncil;
  }
  
  // Ακύρωση
  cancel() {
    if (this.disciplineCouncilInmateApologyForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.disciplineOffense.apology = this.lastApology;
          this.dynamicDialogRef.close();
        },
        reject: () => {

        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }

  // Αποθήκευση απολογίας κρατούμενου
  saveDisciplineOffenseInmateApology() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineOffenseService.saveDisciplineOffense(this.disciplineOffense).subscribe({
      next: (responseData: DisciplineOffense) => {
        let savedDisciplineOffense: DisciplineOffense = responseData;
        this.dynamicDialogRef.close(savedDisciplineOffense);
        this.disciplineOffense.apology = savedDisciplineOffense.apology;
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  // Μέθοδος κλειδώματος πεδίων υπό συνθήκη 
  // Ελέγχει αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απολογία του κρατούμενου, έχει ολοκληρωθεί
  lockIfDisciplineCouncilOfInmateApologyIsComplete(): boolean {

    // Αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απολογία του κρατούμενου, έχει ολοκληρωθεί
    if (this.disciplineCouncil.completed) {
      return true;
    } else {
      return false;
    }

  }

  // Μέθοδος απόκρυψης πεδίων υπό συνθήκη 
  // Ελέγχει αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απολογία του κρατούμενου, έχει ολοκληρωθεί
  showIfDisciplineCouncilOfInmateApologyIsComplete(): boolean {

    // Αν το συμβούλιο πειθαρχικών, στο οποία ανήκει η απολογία του κρατούμενου, έχει ολοκληρωθεί
    if (this.disciplineCouncil.completed) {
      return true;
    } else {
      return false;
    }

  }
  
}
