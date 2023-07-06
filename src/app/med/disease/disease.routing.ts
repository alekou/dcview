import {Routes} from '@angular/router';
import {DiseaseListComponent} from './disease-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {DiseaseViewComponent} from './disease-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DiseaseResolver} from './disease.resolver';

export const diseaseRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: DiseaseListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.disease',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.disease'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: DiseaseViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.disease.new',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.disease.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: DiseaseViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DiseaseResolver},
        data: {
          title: 'med.disease.edit',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.disease.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
