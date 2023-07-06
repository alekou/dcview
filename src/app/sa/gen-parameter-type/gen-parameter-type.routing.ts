import {Routes} from '@angular/router';
import {GenParameterTypeListComponent} from './gen-parameter-type-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';

export const genParameterTypeRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: GenParameterTypeListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.genParameterType',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.genParameterType'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
