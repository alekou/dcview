import {Routes} from '@angular/router';
import {AppLogListComponent} from './app-log-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';

export const appLogRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: AppLogListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.appLog',
          breadcrumbs: [
            {label: 'sa.appLog'}
          ],
          permissions: [], anyPermission: true
        }
      }
    ]
  },
];
