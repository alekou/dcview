import {Routes} from '@angular/router';
import {MedicalFolderListComponent} from './medical-folder-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {MedicalFolderViewComponent} from './medical-folder-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {InmateResolver} from '../../inm/inmate/inmate.resolver';

export const medicalFolderRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: MedicalFolderListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.medicalFolder',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.medicalFolder'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: MedicalFolderViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.medicalFolder.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.medicalFolder.edit'},
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: MedicalFolderViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: InmateResolver},
        data: {
          title: 'med.medicalFolder.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.medicalFolder.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
