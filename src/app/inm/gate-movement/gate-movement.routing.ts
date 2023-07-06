import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {GateMovementListComponent} from './gate-movement-list.component';
import {GateMovementViewComponent} from './gate-movement-view.component';
import {GateMovementMassCreateComponent} from './gate-movement-mass-create.component';
import {GateMovementMassCloseComponent} from './gate-movement-mass-close.component';
import {GateMovementResolver} from './gate-movement.resolver';

export const gateMovementRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: GateMovementListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.gateMovement',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.gateMovement'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: GateMovementViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.gateMovement.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.gateMovement.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: GateMovementViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: GateMovementResolver},
        data: {
          title: 'inm.gateMovement.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.gateMovement.edit'}
          ],
          permissions: []
        }
      },
      {
        path: 'masscreate', component: GateMovementMassCreateComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.gateMovement.massCreate',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.gateMovement.massCreate'}
          ],
          permissions: []
        }
      },
      {
        path: 'massclose', component: GateMovementMassCloseComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.gateMovement.massClose',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.gateMovement.massClose'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
