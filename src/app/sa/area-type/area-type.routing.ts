import {Routes} from '@angular/router';
import {AreaTypeListComponent} from './area-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {AreaTypeViewComponent} from './area-type-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {AreaTypeResolver} from './area-type.resolver';

export const areaTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: AreaTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.areaType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.areaType'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: AreaTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.areaType.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.areaType.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: AreaTypeViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: AreaTypeResolver},
        data: {
          title: 'sa.areaType.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.areaType.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
