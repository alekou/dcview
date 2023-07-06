import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {EventRecordListComponent} from './event-record-list.component';
import {EventRecordViewComponent} from './event-record-view.component';
import {EventRecordResolver} from './event-record.resolver';

export const eventRecordRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: EventRecordListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.eventRecord',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.eventRecord'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: EventRecordViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.eventRecord.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.eventRecord.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: EventRecordViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: EventRecordResolver},
        data: {
          title: 'inm.eventRecord.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.eventRecord.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
