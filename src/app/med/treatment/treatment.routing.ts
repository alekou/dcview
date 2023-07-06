import {Routes} from '@angular/router';
import {TreatmentListComponent} from './treatment-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {TreatmentViewComponent} from './treatment-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {TreatmentResolver} from './treatment.resolver';

export const treatmentRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: TreatmentListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.treatment',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.treatment'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: TreatmentViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.treatment.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.treatment.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: TreatmentViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: TreatmentResolver},
        data: {
          title: 'med.treatment.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.treatment.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
