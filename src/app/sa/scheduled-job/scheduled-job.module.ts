import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {scheduledJobRouting} from './scheduled-job.routing';
import {ScheduledJobComponent} from './scheduled-job.component';


@NgModule({
  declarations: [
    ScheduledJobComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(scheduledJobRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class ScheduledJobModule {
}
