import {Routes} from '@angular/router';
import {DetentionCenterListComponent} from './detention-center-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {DetentionCenterViewComponent} from './detention-center-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DetentionCenterResolver} from './detention-center.resolver';

export const detentionCenterRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: DetentionCenterListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.detentionCenter',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.detentionCenter'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: DetentionCenterViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.detentionCenter.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.detentionCenter.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: DetentionCenterViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DetentionCenterResolver},
        data: {
          title: 'sa.detentionCenter.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.detentionCenter.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
