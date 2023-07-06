import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {disciplineReportRoutes} from './discipline-report.routing';
import {DisciplineReportListComponent} from './discipline-report-list.component';
import {DisciplineReportViewComponent} from './discipline-report-view.component';
import {DisciplineOffenseViewDialogComponent} from '../discipline-offense/discipline-offense-view-dialog/discipline-offense-view-dialog.component';
import {SelectDisciplineOffensesToRelateDialogComponent} from '../discipline-offense/discipline-offense-view-dialog/select-discipline-offenses-to-relate/select-discipline-offenses-to-relate-dialog.component';
import {DisplayRelatedDisciplineReportsOfDisciplineOffenseDialogComponent} from '../discipline-offense/discipline-offense-view-dialog/display-related-discipline-reports-of-discipline-offense/display-related-discipline-reports-of-discipline-offense-dialog.component';

@NgModule({
  declarations: [
    DisciplineReportListComponent,
    DisciplineReportViewComponent,
    DisciplineOffenseViewDialogComponent,
    SelectDisciplineOffensesToRelateDialogComponent,
    DisplayRelatedDisciplineReportsOfDisciplineOffenseDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(disciplineReportRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class DisciplineReportModule {
}
