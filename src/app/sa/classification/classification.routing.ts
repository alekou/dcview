import {Routes} from '@angular/router';
import {ClassificationListComponent} from './classification-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ClassificationViewComponent} from './classification-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ClassificationResolver} from './classification.resolver';

export const classificationRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ClassificationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.classification',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.classification'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ClassificationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.classification.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.classification.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ClassificationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ClassificationResolver},
        data: {
          title: 'sa.classification.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.classification.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
