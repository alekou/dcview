import {Routes} from '@angular/router';
import {VisitTypeListComponent} from './visit-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {VisitTypeViewComponent} from './visit-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitTypeResolver} from './visit-type.resolver';

export const visitTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VisitTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.visitType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.visitType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VisitTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.visitType.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.visitType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VisitTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VisitTypeResolver},
        data: {
          title: 'sa.visitType.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.visitType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
