import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitProgramListComponent} from './visit-program-list.component';
import {VisitProgramViewComponent} from './visit-program-view.component';
import {VisitProgramResolver} from './visit-program.resolver';

export const visitProgramRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VisitProgramListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.visitProgram',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visitProgram'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VisitProgramViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.visitProgram.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visitProgram'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VisitProgramViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VisitProgramResolver},
        data: {
          title: 'inm.visitProgram.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.visitProgram'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
