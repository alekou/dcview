import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DisciplineOffenseService} from '../../../discipline-offense/discipline-offense.service';

@Component({
  selector: 'app-inm-unmerge-discipline-offenses-dialog',
  templateUrl: 'unmerge-discipline-offenses-dialog.component.html'
})
export class UnmergeDisciplineOffensesDialogComponent implements OnInit{

  inmateId = null;
  disciplineOffenseIdToUnmerge = null;
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private disciplineOffenseService: DisciplineOffenseService
    
  ) {
  }
  
  ngOnInit() {
    // id κρατουμένου του συγχωνευτικού πειθαρχικού παραπτώματος που επρόκειτο να αποσυγχωνευθεί
    this.inmateId = this.dynamicDialogConfig.data.inmateId;
    // id συγχωνευτικού πειθαρχικού παραπτώματος που επρόκειτο να αποσυγχωνευθεί
    this.disciplineOffenseIdToUnmerge = this.dynamicDialogConfig.data.disciplineOffenseIdToUnmerge;

  }

  // Επιβεβαίωση Αποσυγχώνευσης
  unmergeDisciplineOffenses() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineOffenseService.unmergeDisciplineOffense(this.inmateId, this.disciplineOffenseIdToUnmerge).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('disciplineDecision.unmergeDisciplineOffenses.unmerge.success'));
        this.dynamicDialogRef.close(true);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  
 // Ακύρωση
  cancel() {
    this.toitsuToasterService.clearMessages();
    this.dynamicDialogRef.close();
  }

}
