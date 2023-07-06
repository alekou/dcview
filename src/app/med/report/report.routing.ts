import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {ReportViewComponent} from '../../sa/report/report-view.component';
import {ReportResolver} from '../../sa/report/report.resolver';

export const reportRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'view', component: ReportViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.report.new',
          breadcrumbs: [
            {label: 'sa.report'},
            {label: 'sa.report.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: ReportViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: ReportResolver},
        data: {
          title: 'sa.report.edit',
          breadcrumbs: [
            {label: 'sa.report'},
            {label: 'sa.report.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
