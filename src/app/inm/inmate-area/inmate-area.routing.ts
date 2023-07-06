import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {InmateAreaManageComponent} from './inmate-area-manage.component';
import {InmateAreaHistoryComponent} from './inmate-area-history.component';
import {InmateAreaCatalogComponent} from './inmate-area-catalog.component';
import {TopAreasResolver} from '../area/top-areas.resolver';

export const inmateAreaRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'manage', component: InmateAreaManageComponent, canActivate: [AuthGuard],
        resolve: {record: TopAreasResolver},
        data: {
          title: 'inm.inmateArea.manage',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.subgroup.inmateArea'},
            {label: 'inm.inmateArea.manage'}
          ],
          permissions: []
        }
      },
      {path: 'history', component: InmateAreaHistoryComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmateArea.history',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.subgroup.inmateArea'},
            {label: 'inm.inmateArea.history'}
          ],
          permissions: []
        }
      },
      {path: 'catalog', component: InmateAreaCatalogComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmateArea.catalog',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.subgroup.inmateArea'},
            {label: 'inm.inmateArea.catalog'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
