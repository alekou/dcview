import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ProgramApplicationListComponent} from './program-application-list.component';
import {ProgramApplicationViewComponent} from './program-application-view.component';
import {ProgramApplicationResolver} from './program-application.resolver';

export const programApplicationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ProgramApplicationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.programApplication',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programApplication'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ProgramApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.programApplication.new',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programApplication.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ProgramApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ProgramApplicationResolver},
        data: {
          title: 'inm.programApplication.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programApplication.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
