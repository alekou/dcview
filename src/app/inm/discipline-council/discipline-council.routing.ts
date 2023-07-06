import {Routes} from '@angular/router';
import {DisciplineCouncilListComponent} from './discipline-council-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DisciplineCouncilViewComponent} from './discipline-council-view.component';
import {DisciplineCouncilResolver} from './discipline-council.resolver';


export const disciplineCouncilRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {
        path: 'list', component: DisciplineCouncilListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.disciplineCouncil',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.disciplineCouncil'}
          ],
          permissions: []
        }
      },
      {
        path: 'view',
        component: DisciplineCouncilViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.disciplineCouncil.new',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.disciplineCouncil'},
          ],
          permissions: []
        }
      },
      {
        path: 'view/:id',
        component: DisciplineCouncilViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DisciplineCouncilResolver},
        data: {
          title: 'inm.disciplineCouncil.edit',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.disciplineCouncil'},
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
