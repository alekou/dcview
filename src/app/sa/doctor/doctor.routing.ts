import {Routes} from '@angular/router';
import {DoctorListComponent} from './doctor-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {DoctorViewComponent} from './doctor-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DoctorResolver} from './doctor.resolver';

export const doctorRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: DoctorListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.doctor',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.doctor'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: DoctorViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.doctor.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.doctor.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: DoctorViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DoctorResolver},
        data: {
          title: 'sa.doctor.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.doctor.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
