import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {LaborProtocolListComponent} from './labor-protocol-list.component';
import {LaborProtocolViewComponent} from './labor-protocol-view.component';
import {LaborProtocolResolver} from './labor-protocol.resolver';

export const laborProtocolRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: LaborProtocolListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.laborProtocol',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborProtocol'}
          ],
          permissions: ['inm_laborprotocol_index']
        }
      },
      {path: 'view', component: LaborProtocolViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.laborProtocol.new',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborProtocol.new'}
          ],
          permissions: ['inm_laborprotocol_create']
        }
      },
      {path: 'view/:id', component: LaborProtocolViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: LaborProtocolResolver},
        data: {
          title: 'inm.laborProtocol.edit',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborProtocol.edit'}
          ],
          permissions: ['inm_laborprotocol_update']
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
