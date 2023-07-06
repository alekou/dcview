import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';

import {ReportCreateComponent} from './report-create.component';


export const reportRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'create/:application/:templateId/:entity/:entityId/:entityIdColName', component: ReportCreateComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.report',
          breadcrumbs: [],
          // permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
