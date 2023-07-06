import {Routes} from '@angular/router';
import {ExaminationTypeListComponent} from './examination-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExaminationTypeViewComponent} from './examination-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ExaminationTypeResolver} from './examination-type.resolver';

export const examinationTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ExaminationTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.examinationType',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.examinationType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ExaminationTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.examinationType.new',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.examinationType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ExaminationTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ExaminationTypeResolver},
        data: {
          title: 'med.examinationType.edit',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.examinationType.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
