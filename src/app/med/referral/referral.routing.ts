import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ReferralListComponent} from './referral-list.component';
import {ReferralViewComponent} from './referral-view.component';
import {ReferralResolver} from './referral.resolver';

export const referralRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: ReferralListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.referral',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.referral'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: ReferralViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.referral.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.referral.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ReferralViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ReferralResolver},
        data: {
          title: 'med.referral.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.referral.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
