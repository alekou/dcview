import {Routes} from '@angular/router';
import {HospitalListComponent} from './hospital-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {HospitalViewComponent} from './hospital-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {HospitalResolver} from './hospital.resolver';

export const hospitalRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: HospitalListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.hospital',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.hospital'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: HospitalViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.hospital.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.hospital.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: HospitalViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: HospitalResolver},
        data: {
          title: 'sa.hospital.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.hospital.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
