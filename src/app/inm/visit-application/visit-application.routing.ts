import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitApplicationListComponent} from './visit-application-list.component';
import {VisitApplicationViewComponent} from './visit-application-view.component';
import {VisitApplicationResolver} from './visit-application.resolver';

export const visitApplicationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VisitApplicationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.visitApplication',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.visitApplication'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VisitApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.visitApplication.new',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.visitApplication.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VisitApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VisitApplicationResolver},
        data: {
          title: 'inm.visitApplication.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.visitApplication.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
