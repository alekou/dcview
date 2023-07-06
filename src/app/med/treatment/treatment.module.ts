import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {treatmentRouting} from './treatment.routing';
import {TreatmentListComponent} from './treatment-list.component';
import {TreatmentViewComponent} from './treatment-view.component';

@NgModule({
  declarations: [
    TreatmentListComponent,
    TreatmentViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(treatmentRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class TreatmentModule {
}
