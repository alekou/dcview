import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VacationCouncilListComponent} from './vacation-council-list.component';
import {VacationCouncilViewComponent} from './vacation-council-view.component';
import {VacationCouncilResolver} from './vacation-council.resolver';

export const vacationCouncilRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VacationCouncilListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.vacationCouncil',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationCouncil'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VacationCouncilViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.vacationCouncil.new',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationCouncil.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VacationCouncilViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VacationCouncilResolver},
        data: {
          title: 'inm.vacationCouncil.edit',
          breadcrumbs: [
            {label: 'inm.group.vacation'},
            {label: 'inm.vacationCouncil.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
