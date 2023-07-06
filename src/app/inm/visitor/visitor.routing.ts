import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitorListComponent} from './visitor-list.component';
import {VisitorViewComponent} from './visitor-view.component';
import {VisitorResolver} from './visitor.resolver';

export const visitorRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VisitorListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.visitor',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visitor'}
          ],
          permissions: ['inm_visitor_index']
        }
      },
      {path: 'view', component: VisitorViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.visitor.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visitor'}
          ],
          permissions: ['inm_visitor_create']
        }
      },
      {path: 'view/:id', component: VisitorViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VisitorResolver},
        data: {
          title: 'inm.visitor.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visitor'}
          ],
          permissions: ['inm_visitor_update']
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
