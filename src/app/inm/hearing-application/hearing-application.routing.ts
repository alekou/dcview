import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {HearingApplicationListComponent} from '../../med/hearing-application/hearing-application-list.component';
import {HearingApplicationViewComponent} from '../../med/hearing-application/hearing-application-view.component';
import {HearingApplicationResolver} from '../../med/hearing-application/hearing-application.resolver';

export const inmHearingApplicationRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: HearingApplicationListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.hearingApplication',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'med.hearingApplication'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: HearingApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.hearingApplication.new',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'med.hearingApplication.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: HearingApplicationViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: HearingApplicationResolver},
        data: {
          title: 'med.hearingApplication.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'med.hearingApplication.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
