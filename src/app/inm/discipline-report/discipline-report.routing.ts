import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DisciplineReportListComponent} from './discipline-report-list.component';
import {DisciplineReportViewComponent} from './discipline-report-view.component';
import {DisciplineReportResolver} from './discipline-report.resolver';

export const disciplineReportRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {
        path: 'list', component: DisciplineReportListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.disciplineReport',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.disciplineReport'}
          ],
          permissions: []
        }
      },
      {
        path: 'view',
        component: DisciplineReportViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.disciplineReport.new',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.disciplineReport'},
          ],
          permissions: []
        }
      },
      {
        path: 'view/:id',
        component: DisciplineReportViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DisciplineReportResolver},
        data: {
          title: 'inm.disciplineReport.edit',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.disciplineReport'},
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
