import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ScheduledJobComponent} from './scheduled-job.component';

export const scheduledJobRouting: Routes = [
  {
    path: '', component: ScheduledJobComponent, canActivate: [AuthGuard],
    data: {
      title: 'sa.scheduledJob',
      breadcrumbs: [
        {label: 'sa.scheduledJob'}
      ],
      permissions: []
    }
  }
  
];

