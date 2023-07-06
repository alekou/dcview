import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {AppealListComponent} from './appeal-list.component';
import {AppealViewComponent} from './appeal-view.component';
import {AppealResolver} from './appeal.resolver';

export const appealRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: AppealListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.appeal',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.appeal'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: AppealViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.appeal.new',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.appeal.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: AppealViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: AppealResolver},
        data: {
          title: 'inm.appeal.edit',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.appeal.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
