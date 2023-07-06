import {Routes} from '@angular/router';
import {CourthouseListComponent} from './courthouse-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {CourthouseViewComponent} from './courthouse-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {CourthouseResolver} from './courthouse.resolver';

export const courthouseRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: CourthouseListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.courthouse',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.courthouse'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: CourthouseViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.courthouse.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.courthouse.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: CourthouseViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: CourthouseResolver},
        data: {
          title: 'sa.courthouse.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.courthouse.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // ------------------------------------------------------------------------------------------------------------------- 
];
