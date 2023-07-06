import {Routes} from '@angular/router';
import {VaccineListComponent} from './vaccine-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {VaccineViewComponent} from './vaccine-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VaccineResolver} from './vaccine.resolver';

export const vaccineRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VaccineListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.vaccine',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.vaccine'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VaccineViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.vaccine.new',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.vaccine.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VaccineViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VaccineResolver},
        data: {
          title: 'med.vaccine.edit',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.vaccine.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
