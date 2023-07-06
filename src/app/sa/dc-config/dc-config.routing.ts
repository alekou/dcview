import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {DcConfigComponent} from './dc-config.component';
import {DcConfigResolver} from './dc-config.resolver';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';

export const dcConfigRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: '', component: DcConfigComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DcConfigResolver},
        data: {
          title: 'sa.dcConfig',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.dcConfig'}
          ],
          permissions: []
        }
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------------------------
];
