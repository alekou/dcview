import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {HearingApplicationListComponent} from './hearing-application-list.component';
import {HearingApplicationViewComponent} from './hearing-application-view.component';
import {HearingApplicationResolver} from './hearing-application.resolver';

export const medHearingApplicationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: HearingApplicationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.hearingApplication',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.hearingApplication'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: HearingApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.hearingApplication.new',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.hearingApplication.new'},
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: HearingApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: HearingApplicationResolver},
        data: {
          title: 'med.hearingApplication.edit',
          breadcrumbs: [
            {label: 'med.group.medicalDepartment'},
            {label: 'med.hearingApplication.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
