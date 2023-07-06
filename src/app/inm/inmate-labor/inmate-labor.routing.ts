import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {InmateLaborListComponent} from './inmate-labor-list.component';
import {InmateLaborViewComponent} from './inmate-labor-view.component';
import {InmateLaborResolver} from './inmate-labor.resolver';

export const inmateLaborRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: InmateLaborListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmateLabor',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLabor'}
          ],
          permissions: ['inm_inmatelabor_index']
        }
      },
      {path: 'view', component: InmateLaborViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.inmateLabor.new',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLabor.new'}
          ],
          permissions: ['inm_inmatelabor_create']
        }
      },
      {path: 'view/:id', component: InmateLaborViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: InmateLaborResolver},
        data: {
          title: 'inm.inmateLabor.edit',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.inmateLabor.edit'}
          ],
          permissions: ['inm_inmatelabor_update']
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
