import {Routes} from '@angular/router';
import {GenParameterListComponent} from './gen-parameter-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';

export const genParameterRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: GenParameterListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.genParameter',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.genParameter'}
          ],
          permissions: []
        }
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------------------------
];
