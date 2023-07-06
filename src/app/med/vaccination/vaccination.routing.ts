import {Routes} from '@angular/router';
import {VaccinationListComponent} from './vaccination-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {VaccinationViewComponent} from './vaccination-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {VaccinationResolver} from './vaccination.resolver';

export const vaccinationRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: VaccinationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.vaccination',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.vaccination'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: VaccinationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.vaccination.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.vaccination.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: VaccinationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: VaccinationResolver},
        data: {
          title: 'med.vaccination.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.vaccination.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
