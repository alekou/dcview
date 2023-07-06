import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {PlacementProtocolListComponent} from './placement-protocol-list.component';
import {PlacementProtocolViewComponent} from './placement-protocol-view.component';
import {PlacementProtocolResolver} from './placement-protocol.resolver';

export const placementProtocolRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: PlacementProtocolListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.placementProtocol',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.placementProtocol'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: PlacementProtocolViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.placementProtocol.new',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.placementProtocol.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: PlacementProtocolViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: PlacementProtocolResolver},
        data: {
          title: 'inm.placementProtocol.edit',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.placementProtocol.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
