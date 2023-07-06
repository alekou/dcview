import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DisciplineListComponent} from './discipline-list.component';
import {DisciplineViewComponent} from './discipline-view.component';
import {DisciplineResolver} from './discipline.resolver';
import {
  InmateLaborApplicationMassCreateComponent
} from '../inmate-labor-application/inmate-labor-application-mass-create-component';
import {DisciplineMassCreateComponent} from './discipline-mass-create-component';

export const disciplineRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: DisciplineListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.discipline',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.discipline'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: DisciplineViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.discipline.new',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.discipline'},
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: DisciplineViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DisciplineResolver},
        data: {
          title: 'inm.discipline.edit',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.discipline'},
          ],
          permissions: []
        }
      },
      {
        path: 'masscreate', component: DisciplineMassCreateComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'global.massCreate',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.subgroup.discipline'},
            {label: 'inm.discipline'},
            {label: 'global.massCreate'}
          ],
          permissions: []
        }
      },
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
