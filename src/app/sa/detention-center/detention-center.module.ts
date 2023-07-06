import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {detentionCenterRouting} from './detention-center.routing';
import {DetentionCenterListComponent} from './detention-center-list.component';
import {DetentionCenterViewComponent} from './detention-center-view.component';

@NgModule({
  declarations: [
    DetentionCenterListComponent,
    DetentionCenterViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(detentionCenterRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class DetentionCenterModule {
}
