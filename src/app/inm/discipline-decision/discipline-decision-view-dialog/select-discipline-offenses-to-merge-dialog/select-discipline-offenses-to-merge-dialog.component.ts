import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DisciplineOffense} from '../../../discipline-offense/discipline-offense.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DisciplineOffenseService} from '../../../discipline-offense/discipline-offense.service';


@Component({
  selector: 'app-inm-select-discipline-offenses-to-merge-dialog',
  templateUrl: 'select-discipline-offenses-to-merge-dialog.component.html'
})

export class SelectDisciplineOffensesToMergeDialogComponent implements OnInit {

  @ViewChild(NgForm) selectDisciplineOffensesToMergeForm: NgForm;
  inmateId: number;
  candidateDisciplineOffensesToMerge = [];
  mergingDisciplineOffense = {
    inmateId: null,
    points: null,
    disciplineOffenseIdsToMerge: []
  };

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private disciplineOffenseService: DisciplineOffenseService
    

  ) {
  }
  
  
  ngOnInit() {
    // id κρατουμένου στον οποίο ανήκουν τα υποψήφια προς συγχώνευση πειθαρχικά παραπτώματα
    this.mergingDisciplineOffense.inmateId = this.dynamicDialogConfig.data.inmateId;
    // Λίστα με τα υποψήφια προς συγχώνευση πειθαρχικά παραπτώματα
    this.candidateDisciplineOffensesToMerge = this.dynamicDialogConfig.data.candidateDisciplineOffensesToMerge;

  }
  
  // Συγχώνευση
  mergeDisciplineOffenses() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineOffenseService.mergeDisciplineOffenses(this.mergingDisciplineOffense).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('disciplineDecision.mergeDisciplineOffenses.merge.success'));
        this.dynamicDialogRef.close(this.mergingDisciplineOffense);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  // Επιβεβαίωση
  // Χρησιμοποιείται μόνο για να κλείσει το dialog όταν τα υποψήφια προς συγχώνευση πειθαρχικά παραπτώματα είναι λιγότερα από δύο.
  confirm() {
    this.dynamicDialogRef.close();
  }

  // Ακύρωση
  cancel() {
    if (this.selectDisciplineOffensesToMergeForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {
        }
      });
    } else {
      this.dynamicDialogRef.close();
    }
  }
  
  
  
  
}
