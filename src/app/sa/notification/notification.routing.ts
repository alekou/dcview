import {Routes} from '@angular/router';

import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {NotificationListComponent} from './notification-list.component';
import {NotificationViewComponent} from './notification-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {NotificationResolver} from './notification.resolver';

export const notificationRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: NotificationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.notification',
          breadcrumbs: [
            {label: 'sa.group.notifications'},
            {label: 'sa.notification'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: NotificationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.notification.new',
          breadcrumbs: [
            {label: 'sa.group.notifications'},
            {label: 'sa.notification.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: NotificationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: NotificationResolver},
        data: {
          title: 'sa.notification.edit',
          breadcrumbs: [
            {label: 'sa.group.notifications'},
            {label: 'sa.notification.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
