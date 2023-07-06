import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DoctorSessionResolver} from './doctor-session.resolver';
import {DoctorSessionListComponent} from './doctor-session-list.component';
import {DoctorSessionViewComponent} from './doctor-session-view.component';

export const doctorSessionRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',

    children: [
      {
        path: 'psychologist', children: [
          {
            path: 'list', component: DoctorSessionListComponent, canActivate: [AuthGuard],
            data: {
              title: 'inm.doctorSession.psychologist',
              breadcrumbs: [
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.psychologist'}
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
                {label: 'inm.group.service'},
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
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.edit'}
              ],
              permissions: []
            }
          }
        ]
      },
      {
        path: 'socialworker', children: [
          {
            path: 'list', component: DoctorSessionListComponent, canActivate: [AuthGuard],
            data: {
              title: 'inm.doctorSession.socialworker',
              breadcrumbs: [
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.socialworker'}
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
                {label: 'inm.group.service'},
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
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.edit'}
              ],
              permissions: []
            }
          }
        ]
      },
      {
        path: 'sociologist', children: [
          {
            path: 'list', component: DoctorSessionListComponent, canActivate: [AuthGuard],
            data: {
              title: 'inm.doctorSession.sociologist',
              breadcrumbs: [
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.sociologist'}
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
                {label: 'inm.group.service'},
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
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.edit'}
              ],
              permissions: []
            }
          }
        ]
      },
      {
        path: 'criminologist', children: [
          {
            path: 'list', component: DoctorSessionListComponent, canActivate: [AuthGuard],
            data: {
              title: 'inm.doctorSession.criminologist',
              breadcrumbs: [
                {label: 'inm.group.service'},
                {label: 'inm.doctorSession.criminologist'}
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
                {label: 'inm.group.service'},
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
                {label: 'inm.group.service'},
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
