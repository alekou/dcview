import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {vacationApplicationRoutes} from './vacation-application.routing';
import {VacationApplicationListComponent} from './vacation-application-list.component';
import {VacationApplicationViewComponent} from './vacation-application-view.component';
import {VacationMotionListComponent} from './vacation-motion-list.component';
import {VacationMotionViewComponent} from './vacation-motion-view.component';

@NgModule({
  declarations: [
    VacationApplicationListComponent,
    VacationApplicationViewComponent,
    VacationMotionListComponent,
    VacationMotionViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vacationApplicationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VacationApplicationModule {
}
