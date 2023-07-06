import {Component, OnInit, ViewChild} from '@angular/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {Discipline} from '../discipline.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-inm-select-disciplines-to-merge-list-dialog',
  templateUrl: 'select-disciplines-to-merge-dialog.component.html'
})

export class SelectDisciplinesToMergeDialogComponent implements OnInit {
  id: number;
  discipline: Discipline;
  mergingDisciplines = [];
  selectedMergingDisciplines = [];
  @ViewChild(NgForm) disciplinesToMergeForm: NgForm;


  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private dynamicDialogConfig: DynamicDialogConfig,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {
    this.mergingDisciplines = this.dynamicDialogConfig.data['mergingDisciplines'];
    this.selectedMergingDisciplines = this.dynamicDialogConfig.data['selectedMergingDisciplines'];
  }

  ngOnInit() {
    
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

  }

  // Επιβεβαίωση
  confirm() {
    if (!this.selectedMergingDisciplines) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.selectedMergingDisciplines);
    }
  }
  
  // Ακύρωση
  cancel() {
    if (this.disciplinesToMergeForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
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
  
}
