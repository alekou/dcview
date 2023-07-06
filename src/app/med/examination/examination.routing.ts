import {Routes} from '@angular/router';
import {ExaminationListComponent} from './examination-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExaminationViewComponent} from './examination-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ExaminationResolver} from './examination.resolver';

export const examinationRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ExaminationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.examination',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.examination'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ExaminationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.examination.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.examination.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ExaminationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ExaminationResolver},
        data: {
          title: 'med.examination.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.examination.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
