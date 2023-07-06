import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ActivatedRoute} from '@angular/router';
import {DisciplineReport} from '../../../discipline-report/discipline-report.model';

@Component({
  selector: 'app-inm-display-related-discipline-reports-of-discipline-offense-dialog',
  templateUrl: 'display-related-discipline-reports-of-discipline-offense-dialog.component.html'
})

export class DisplayRelatedDisciplineReportsOfDisciplineOffenseDialogComponent implements OnInit {
  id: number;
  relatedDisciplineReportsOfDisciplineOffense = [];
  viewLink = '/inm/disciplinereport/view';
  disciplineReport: DisciplineReport = new DisciplineReport();
  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private toitsuToasterService: ToitsuToasterService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private route: ActivatedRoute,
  ) {
    this.relatedDisciplineReportsOfDisciplineOffense = this.dynamicDialogConfig.data['relatedDisciplineReportsOfDisciplineOffense'];
    this.disciplineReport = this.dynamicDialogConfig.data['disciplineReport'];
  }

  ngOnInit() {

    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];


  }
  
  // Επιβεβαίωση
  close() {
    this.dynamicDialogRef.close();
  }
  
}
