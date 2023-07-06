import {Routes} from '@angular/router';
import {ProgramTypeListComponent} from './program-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ProgramTypeViewComponent} from './program-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ProgramTypeResolver} from './program-type.resolver';

export const programTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ProgramTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.programType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.programType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ProgramTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.programType.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.programType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ProgramTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ProgramTypeResolver},
        data: {
          title: 'sa.programType.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.programType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
