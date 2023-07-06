import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {vacationRoutes} from './vacation.routing';
import {VacationListComponent} from './vacation-list.component';
import {VacationViewComponent} from './vacation-view.component';

@NgModule({
  declarations: [
    VacationListComponent,
    VacationViewComponent,
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vacationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VacationModule {
}
