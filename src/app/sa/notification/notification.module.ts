import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {notificationRouting} from './notification.routing';
import {NotificationListComponent} from './notification-list.component';
import {NotificationViewComponent} from './notification-view.component';

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(notificationRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class NotificationModule {
}
