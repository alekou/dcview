import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {laborDayRoutes} from './labor-day.routing';
import {LaborDayListComponent} from './labor-day-list.component';
import {LaborDayViewComponent} from './labor-day-view.component';
import {LaborDayAddNormalComponent} from './labor-day-add-normal.component';
import {LaborDayAddSpecialComponent} from './labor-day-add-special.component';

@NgModule({
  declarations: [
    LaborDayListComponent,
    LaborDayViewComponent,
    LaborDayAddNormalComponent,
    LaborDayAddSpecialComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(laborDayRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class LaborDayModule {
}
