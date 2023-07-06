import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ProgramProtocolListComponent} from './program-protocol-list.component';
import {ProgramProtocolViewComponent} from './program-protocol-view.component';
import {ProgramProtocolResolver} from './program-protocol.resolver';

export const programProtocolRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ProgramProtocolListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.programProtocol',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programProtocol'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ProgramProtocolViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.programProtocol.new',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programProtocol.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ProgramProtocolViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ProgramProtocolResolver},
        data: {
          title: 'inm.programProtocol.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.programProtocol.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
