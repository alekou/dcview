import {Routes} from '@angular/router';
import {BloodSamplingListComponent} from './blood-sampling-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {BloodSamplingViewComponent} from './blood-sampling-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {BloodSamplingResolver} from './blood-sampling.resolver';

export const bloodSamplingRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: BloodSamplingListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.bloodSampling',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.bloodSampling'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: BloodSamplingViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.bloodSampling.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.bloodSampling.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: BloodSamplingViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: BloodSamplingResolver},
        data: {
          title: 'med.bloodSampling.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.bloodSampling.edit'}
          ],
          permissions: []
        }
      }
    ] 
  }
  // -------------------------------------------------------------------------------------------------------------------
];
