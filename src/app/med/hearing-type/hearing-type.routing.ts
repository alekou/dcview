import {Routes} from '@angular/router';
import {HearingTypeListComponent} from './hearing-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {HearingTypeViewComponent} from './hearing-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {HearingTypeResolver} from './hearing-type.resolver';

export const hearingTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: HearingTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.hearingType',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.hearingType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: HearingTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.hearingType.new',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.hearingType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: HearingTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: HearingTypeResolver},
        data: {
          title: 'med.hearingType.edit',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.hearingType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
