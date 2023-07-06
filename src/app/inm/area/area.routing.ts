import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {AreaListComponent} from './area-list.component';
import {AreaViewComponent} from './area-view.component';
import {AreaResolver} from './area.resolver';

export const areaRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: AreaListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.area',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.area'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: AreaViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.area.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.area'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: AreaViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: AreaResolver},
        data: {
          title: 'inm.area.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.area'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
