import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {vaccineRouting} from './vaccine.routing';
import {VaccineListComponent} from './vaccine-list.component';
import {VaccineViewComponent} from './vaccine-view.component';

@NgModule({
  declarations: [
    VaccineListComponent,
    VaccineViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vaccineRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VaccineModule {
}
