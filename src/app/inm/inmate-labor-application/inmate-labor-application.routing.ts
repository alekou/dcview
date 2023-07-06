import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {InmateLaborApplicationListComponent} from './inmate-labor-application-list.component';
import {InmateLaborApplicationViewComponent} from './inmate-labor-application-view.component';
import {InmateLaborApplicationResolver} from './inmate-labor-application.resolver';
import {InmateLaborApplicationMassCreateComponent} from './inmate-labor-application-mass-create-component';

export const inmateLaborApplicationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: InmateLaborApplicationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmateLaborApplication',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLaborApplication'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: InmateLaborApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.inmateLaborApplication.new',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLaborApplication.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: InmateLaborApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: InmateLaborApplicationResolver},
        data: {
          title: 'inm.inmateLaborApplication.edit',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLaborApplication.edit'}
          ],
          permissions: []
        }
      },
      {
        path: 'masscreate', component: InmateLaborApplicationMassCreateComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'global.massCreate',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLaborApplication'},
            {label: 'global.massCreate'}
          ],
          permissions: []
        }
      },
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
