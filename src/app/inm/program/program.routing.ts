import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ProgramListComponent} from './program-list.component';
import {ProgramViewComponent} from './program-view.component';
import {ProgramResolver} from './program.resolver';
import {ProgramConductListComponent} from './program-conduct-list.component';
import {ProgramConductViewComponent} from './program-conduct-view.component';

export const programRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ProgramListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.program',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.program'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ProgramViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.program.new',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.program.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ProgramViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ProgramResolver},
        data: {
          title: 'inm.program.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.program.edit'}
          ],
          permissions: []
        }
      },
      {path: 'conduct/list', component: ProgramConductListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.programConduct',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programConduct'}
          ],
          permissions: []
        }
      },
      {path: 'conduct/view/:id', component: ProgramConductViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ProgramResolver},
        data: {
          title: 'inm.programConduct.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programConduct.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
