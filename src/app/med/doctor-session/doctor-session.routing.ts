import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DoctorSessionListComponent} from '../../inm/doctor-session/doctor-session-list.component';
import {DoctorSessionViewComponent} from '../../inm/doctor-session/doctor-session-view.component';
import {DoctorSessionResolver} from '../../inm/doctor-session/doctor-session.resolver';

export const doctorSessionRoutes: Routes = [
  {
    path: '', children: [
      {
        path: 'doctor', children: [
          {
            path: 'list', component: DoctorSessionListComponent, canActivate: [AuthGuard],
            data: {
              title: 'inm.doctorSession',
              breadcrumbs: [
                {label: 'med.group.medicalDepartment'},
                {label: 'inm.doctorSession'}
              ],
              permissions: []
            }
          },
          {
            path: 'view',
            component: DoctorSessionViewComponent,
            canActivate: [AuthGuard],
            canDeactivate: [ExitConfirmationGuard],
            data: {
              title: 'inm.doctorSession.new',
              breadcrumbs: [
                {label: 'med.group.medicalDepartment'},
                {label: 'inm.doctorSession.new'}
              ],
              permissions: []
            }
          },
          {
            path: 'view/:id',
            component: DoctorSessionViewComponent,
            canActivate: [AuthGuard],
            canDeactivate: [ExitConfirmationGuard],
            resolve: {record: DoctorSessionResolver},
            data: {
              title: 'inm.doctorSession.edit',
              breadcrumbs: [
                {label: 'med.group.medicalDepartment'},
                {label: 'inm.doctorSession.edit'}
              ],
              permissions: []
            }
          }
        ]
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------

];
