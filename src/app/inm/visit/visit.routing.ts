import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitListComponent} from './visit-list.component';
import {VisitViewComponent} from './visit-view.component';
import {VisitResolver} from './visit.resolver';
import {VisitLawyerAddComponent} from './visit-lawyer-add.component';

export const visitRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VisitListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.visit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visit'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VisitViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.visit.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visit'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VisitViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VisitResolver},
        data: {
          title: 'inm.visit.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visit'}
          ],
          permissions: []
        }
      },
      {path: 'lawyeradd', component: VisitLawyerAddComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.visit.lawyerAdd',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visit.lawyerAdd'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
