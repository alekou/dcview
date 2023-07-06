import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {vaccinationRouting} from './vaccination.routing';
import {VaccinationListComponent} from './vaccination-list.component';
import {VaccinationViewComponent} from './vaccination-view.component';

@NgModule({
  declarations: [
    VaccinationListComponent,
    VaccinationViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vaccinationRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VaccinationModule {
}
