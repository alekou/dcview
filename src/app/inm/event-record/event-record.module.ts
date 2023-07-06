import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {eventRecordRoutes} from './event-record.routing';
import {EventRecordListComponent} from './event-record-list.component';
import {EventRecordViewComponent} from './event-record-view.component';

@NgModule({
  declarations: [
    EventRecordListComponent,
    EventRecordViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(eventRecordRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class EventRecordModule {
}
