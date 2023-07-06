import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {SessionTypeResolver} from './session-type.resolver';
import {SessionTypeListComponent} from './session-type-list.component';
import {SessionTypeViewComponent} from './session-type-view.component';

export const sessionTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: SessionTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.sessionType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.sessionType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: SessionTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.sessionType.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.sessionType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: SessionTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: SessionTypeResolver},
        data: {
          title: 'sa.sessionType.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.sessionType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
