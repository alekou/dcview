import {Routes} from '@angular/router';
import {GateMovementTypeListComponent} from './gate-movement-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {GateMovementTypeViewComponent} from './gate-movement-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {GateMovementTypeResolver} from './gate-movement-type.resolver';

export const gateMovementTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: GateMovementTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.gateMovementType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.gateMovementType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: GateMovementTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.gateMovementType.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.gateMovementType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: GateMovementTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: GateMovementTypeResolver},
        data: {
          title: 'sa.gateMovementType.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.gateMovementType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
