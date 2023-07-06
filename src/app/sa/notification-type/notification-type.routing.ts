import {Routes} from '@angular/router';

import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {NotificationTypeListComponent} from './notification-type-list.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {NotificationTypeViewComponent} from './notification-type-view.component';
import {NotificationTypeResolver} from './notification-type.resolver';

export const notificationTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: NotificationTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.notificationType',
          breadcrumbs: [
            {label: 'sa.group.notifications'},
            {label: 'sa.notificationType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: NotificationTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.notificationType.new',
          breadcrumbs: [
            {label: 'sa.group.notifications'},
            {label: 'sa.notificationType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: NotificationTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: NotificationTypeResolver},
        data: {
          title: 'sa.notificationType.edit',
          breadcrumbs: [
            {label: 'sa.group.notifications'},
            {label: 'sa.notificationType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
