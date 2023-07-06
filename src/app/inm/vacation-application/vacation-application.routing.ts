import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VacationApplicationListComponent} from './vacation-application-list.component';
import {VacationApplicationViewComponent} from './vacation-application-view.component';
import {VacationMotionListComponent} from './vacation-motion-list.component';
import {VacationMotionViewComponent} from './vacation-motion-view.component';
import {VacationApplicationResolver} from './vacation-application.resolver';

export const vacationApplicationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VacationApplicationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.vacationApplication',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationApplication'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VacationApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.vacationApplication.new',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationApplication.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VacationApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VacationApplicationResolver},
        data: {
          title: 'inm.vacationApplication.edit',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationApplication.edit'}
          ],
          permissions: []
        }
      },
      {path: 'motion/list', component: VacationMotionListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.vacationMotion',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationMotion'}
          ],
          permissions: []
        }
      },
      {path: 'motion/view/:id', component: VacationMotionViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VacationApplicationResolver},
        data: {
          title: 'inm.vacationMotion.edit',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationMotion.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
