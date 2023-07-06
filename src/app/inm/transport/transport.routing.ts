import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {TransportListComponent} from './transport-list.component';
import {TransportViewComponent} from './transport-view.component';
import {TransportResolver} from './transport.resolver';

export const transportRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: TransportListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.transport',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.transport'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: TransportViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.transport.new',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.transport.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: TransportViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: TransportResolver},
        data: {
          title: 'inm.transport.edit',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.transport.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
