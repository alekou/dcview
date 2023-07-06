import {Routes} from '@angular/router';
import {CountryListComponent} from './country-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {CountryViewComponent} from './country-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {CountryResolver} from './country.resolver';

export const countryRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: CountryListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.country',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.country'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: CountryViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.country.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.country.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: CountryViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: CountryResolver},
        data: {
          title: 'sa.country.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.country.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
