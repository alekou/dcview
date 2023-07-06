import {Routes} from '@angular/router';
import {PoliceDepartmentListComponent} from './police-department-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {PoliceDepartmentViewComponent} from './police-department-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {PoliceDepartmentResolver} from './police-department.resolver';

export const policeDepartmentRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: PoliceDepartmentListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.policeDepartment',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.policeDepartment'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: PoliceDepartmentViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.policeDepartment.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.policeDepartment.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: PoliceDepartmentViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: PoliceDepartmentResolver},
        data: {
          title: 'sa.policeDepartment.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.policeDepartment.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
