import {Routes} from '@angular/router';
import {PrescriptionListComponent} from './prescription-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {PrescriptionViewComponent} from './prescription-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {PrescriptionResolver} from './prescription.resolver';

export const prescriptionRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: PrescriptionListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.prescription',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.prescription'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: PrescriptionViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.prescription.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.prescription.new'},
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: PrescriptionViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: PrescriptionResolver},
        data: {
          title: 'med.prescription.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.prescription.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
