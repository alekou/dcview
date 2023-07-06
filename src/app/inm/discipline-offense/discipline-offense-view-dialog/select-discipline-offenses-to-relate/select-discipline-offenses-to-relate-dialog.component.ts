import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {TranslateService} from '@ngx-translate/core';
import {DisciplineOffense} from '../../discipline-offense.model';
import {inmateConsts} from '../../../inmate/inmate.consts';
import {InmateService} from '../../../inmate/inmate.service';
import {NgForm} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';


@Component({
  selector: 'app-inm-select-discipline-offenses-to-relate-dialog',
  templateUrl: 'select-discipline-offenses-to-relate-dialog.component.html'
})

export class SelectDisciplineOffensesToRelateDialogComponent implements OnInit {

  id: number;
  disciplineOffensesToRelate = [];
  selectedDisciplineOffenseToRelate: DisciplineOffense = new DisciplineOffense();
  disciplineOffense: DisciplineOffense = new DisciplineOffense();
  inmates = [];
  inmateDialogUrl: string;
  @ViewChild(NgForm) disciplineOffensesToRelateForm: NgForm;


  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private route: ActivatedRoute,
    private toitsuToasterService: ToitsuToasterService,
    private translate: TranslateService,
    private dynamicDialogRef: DynamicDialogRef,
    private inmateService: InmateService,
    private confirmationService: ConfirmationService


  ) {
    this.disciplineOffensesToRelate = this.dynamicDialogConfig.data.disciplineOffensesToRelate;
    this.selectedDisciplineOffenseToRelate = this.dynamicDialogConfig.data.selectedDisciplineOffenseToRelate;
  }

  ngOnInit() {

    
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
    
    // Discipline Offense
    this.disciplineOffense = this.disciplineOffensesToRelate[0];

  }
  
  // Επιβεβαίωση
  confirm() {
    if (!this.selectedDisciplineOffenseToRelate) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.selectedDisciplineOffenseToRelate);
    }
  }
  
  // Ακύρωση
  cancel() {
    if (this.disciplineOffensesToRelateForm.dirty) {
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
