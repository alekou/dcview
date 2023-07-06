import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {NotificationTypeViewComponent} from './notification-type-view.component';
import {NotificationTypeListComponent} from './notification-type-list.component';
import {notificationTypeRouting} from './notification-type.routing';

@NgModule({
  declarations: [
    NotificationTypeViewComponent,
    NotificationTypeListComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(notificationTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class NotificationTypeModule {
}
