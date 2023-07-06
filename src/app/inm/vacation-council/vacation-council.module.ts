import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {VacationMotionListDialogComponent} from '../vacation-application/vacation-motion-list-dialog/vacation-motion-list-dialog.component';
import {vacationCouncilRoutes} from './vacation-council.routing';
import {VacationCouncilListComponent} from './vacation-council-list.component';
import {VacationCouncilViewComponent} from './vacation-council-view.component';
import {VacationViewDialogComponent} from '../vacation/vacation-view-dialog/vacation-view-dialog.component';

@NgModule({
  declarations: [
    VacationCouncilListComponent,
    VacationCouncilViewComponent,
    VacationViewDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vacationCouncilRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    VacationMotionListDialogComponent
  ]
})
export class VacationCouncilModule {
}
