import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {TransferListComponent} from './transfer-list.component';
import {TransferViewComponent} from './transfer-view.component';
import {TransferInProgressComponent} from './transfer-in-progress.component';
import {TransferResolver} from './transfer.resolver';

export const transferRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: TransferListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.transfer',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.transfer'}
          ],
          permissions: ['inm_transfer_index']
        }
      },
      {path: 'view', component: TransferViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.transfer.new',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.transfer.new'}
          ],
          permissions: ['inm_transfer_create']
        }
      },
      {path: 'view/:id', component: TransferViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: TransferResolver},
        data: {
          title: 'inm.transfer.edit',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.transfer.edit'}
          ],
          permissions: ['inm_transfer_update']
        }
      },
      {path: 'inprogress', component: TransferInProgressComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.transfer.inProgress.title',
          breadcrumbs: [
            {label: 'inm.group.transfer'},
            {label: 'inm.transfer.inProgress'}
          ],
          permissions: ['inm_transfer_update']
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
