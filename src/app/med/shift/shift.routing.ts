import {Routes} from '@angular/router';
import {ShiftListComponent} from './shift-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ShiftViewComponent} from './shift-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ShiftResolver} from './shift.resolver';

export const shiftRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ShiftListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.shift',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.shift'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ShiftViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.shift.new',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.shift.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ShiftViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ShiftResolver},
        data: {
          title: 'med.shift.edit',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.shift.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
