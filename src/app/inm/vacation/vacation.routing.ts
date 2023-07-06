import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VacationListComponent} from './vacation-list.component';
import {VacationViewComponent} from './vacation-view.component';
import {VacationResolver} from './vacation.resolver';

export const vacationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VacationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.vacation',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacation'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VacationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.vacation.new',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacation.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VacationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VacationResolver},
        data: {
          title: 'inm.vacation.edit',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacation', routerLink: ['/inm/vacation/list']}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
