import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {disciplineRoutes} from './discipline.routing';
import {DisciplineListComponent} from './discipline-list.component';
import {DisciplineViewComponent} from './discipline-view.component';
import {SelectDisciplinesToMergeDialogComponent} from './select-disciplines-to-merge/select-disciplines-to-merge-dialog.component';
import {DisplayMergedDisciplinesDialogComponent} from './display-merged-disciplines/display-merged-disciplines-dialog.component';
import {DisciplineMassCreateComponent} from './discipline-mass-create-component';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    DisciplineListComponent,
    DisciplineViewComponent,
    SelectDisciplinesToMergeDialogComponent,
    DisplayMergedDisciplinesDialogComponent,
    DisciplineMassCreateComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(disciplineRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    OverlayPanelModule
  ]
})
export class DisciplineModule {
}
