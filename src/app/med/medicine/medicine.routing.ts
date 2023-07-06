import {Routes} from '@angular/router';
import {MedicineListComponent} from './medicine-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {MedicineViewComponent} from './medicine-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {MedicineResolver} from './medicine.resolver';

export const medicineRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: MedicineListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.medicine',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.medicine'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: MedicineViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.medicine.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.medicine.new'},
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: MedicineViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: MedicineResolver},
        data: {
          title: 'med.medicine.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.medicine.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
