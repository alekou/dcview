import {Routes} from '@angular/router';
import {VacationTypeListComponent} from './vacation-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {VacationTypeViewComponent} from './vacation-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VacationTypeResolver} from './vacation-type.resolver';

export const vacationTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VacationTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.vacationType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.vacationType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VacationTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.vacationType.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.vacationType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VacationTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VacationTypeResolver},
        data: {
          title: 'sa.vacationType.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.vacationType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
