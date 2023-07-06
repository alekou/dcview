import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {CourtSummonsListComponent} from './court-summons-list.component';
import {CourtSummonsViewComponent} from './court-summons-view.component';
import {CourtSummonsResolver} from './court-summons.resolver';

export const courtSummonsRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: CourtSummonsListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.courtSummons',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.courtSummons'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: CourtSummonsViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.courtSummons.new',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.courtSummons.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: CourtSummonsViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: CourtSummonsResolver},
        data: {
          title: 'inm.courtSummons.edit',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.courtSummons.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
