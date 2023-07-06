import {Routes} from '@angular/router';
import {HearingListComponent} from './hearing-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {HearingViewComponent} from './hearing-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {HearingResolver} from './hearing.resolver';

export const hearingRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: HearingListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.hearing',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.hearing'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: HearingViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.hearing.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.hearing.new'},
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: HearingViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: HearingResolver},
        data: {
          title: 'med.hearing.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.hearing.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
