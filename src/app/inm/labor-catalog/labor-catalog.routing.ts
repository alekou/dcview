import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {LaborCatalogComponent} from './labor-catalog.component';
import {LaborCatalogResolver} from './labor-catalog.resolver';

export const laborCatalogRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'laborcatalog/:id', component: LaborCatalogComponent, canActivate: [AuthGuard],
        resolve: {record: LaborCatalogResolver},
        data: {
          title: 'inm.laborCatalog',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate'},
            {label: 'inm.laborCatalog'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
