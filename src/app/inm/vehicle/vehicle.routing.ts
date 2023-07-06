import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VehicleListComponent} from './vehicle-list.component';
import {VehicleViewComponent} from './vehicle-view.component';
import {VehicleResolver} from './vehicle.resolver';

export const vehicleRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VehicleListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.vehicle',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.vehicle'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VehicleViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.vehicle.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.vehicle.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VehicleViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VehicleResolver},
        data: {
          title: 'inm.vehicle.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.vehicle.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
