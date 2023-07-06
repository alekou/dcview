import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {disciplineCouncilRoutes} from './discipline-council.routing';
import {DisciplineCouncilViewComponent} from './discipline-council-view.component';
import {DisciplineCouncilListComponent} from './discipline-council-list.component';
import {SelectDisciplineReportsDialogComponent} from './select-discipline-reports/select-discipline-reports-dialog.component';
import {DisciplineCouncilInmateApologyDialogComponent} from './inmate-apology/discipline-council-inmate-apology-dialog.component';
import {
  DisciplineDecisionViewDialogComponent
} from '../discipline-decision/discipline-decision-view-dialog/discipline-decision-view-dialog.component';
import {
  SelectDisciplineOffensesToMergeDialogComponent
} from '../discipline-decision/discipline-decision-view-dialog/select-discipline-offenses-to-merge-dialog/select-discipline-offenses-to-merge-dialog.component';
import {
  UnmergeDisciplineOffensesDialogComponent
} from '../discipline-decision/discipline-decision-view-dialog/unmerge-discipline-offenses-dialog/unmerge-discipline-offenses-dialog.component';

@NgModule({
  declarations: [
    DisciplineCouncilViewComponent,
    DisciplineCouncilListComponent,
    SelectDisciplineReportsDialogComponent,
    DisciplineCouncilInmateApologyDialogComponent,
    DisciplineDecisionViewDialogComponent,
    SelectDisciplineOffensesToMergeDialogComponent,
    UnmergeDisciplineOffensesDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(disciplineCouncilRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class DisciplineCouncilModule {
}
