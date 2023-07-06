import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {ExaminationTypeListDialogComponent} from '../examination-type/examination-type-list-dialog/examination-type-list-dialog.component';
import {bloodSamplingRoutes} from './blood-sampling.routing';
import {BloodSamplingListComponent} from './blood-sampling-list.component';
import {BloodSamplingViewComponent} from './blood-sampling-view.component';

@NgModule({
  declarations: [
    BloodSamplingListComponent,
    BloodSamplingViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(bloodSamplingRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    ExaminationTypeListDialogComponent
  ]
})
export class BloodSamplingModule {
}
