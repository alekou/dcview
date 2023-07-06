import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {vacationTypeRouting} from './vacation-type.routing';
import {VacationTypeListComponent} from './vacation-type-list.component';
import {VacationTypeViewComponent} from './vacation-type-view.component';

@NgModule({
  declarations: [
    VacationTypeListComponent,
    VacationTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vacationTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class VacationTypeModule {
}
