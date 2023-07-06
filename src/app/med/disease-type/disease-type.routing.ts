import {Routes} from '@angular/router';
import {DiseaseTypeListComponent} from './disease-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {DiseaseTypeViewComponent} from './disease-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DiseaseTypeResolver} from './disease-type.resolver';

export const diseaseTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: DiseaseTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'med.diseaseType',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.diseaseType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: DiseaseTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'med.diseaseType.new',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.diseaseType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: DiseaseTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DiseaseTypeResolver},
        data: {
          title: 'med.diseaseType.edit',
          breadcrumbs: [
            {label: 'med.group.params'},
            {label: 'med.diseaseType.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
