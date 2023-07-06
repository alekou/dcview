import {Routes} from '@angular/router';
import {DirectorListComponent} from './director-list.component';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {DirectorViewComponent} from './director-view.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {DirectorResolver} from './director.resolver';

export const directorRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: DirectorListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.director',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.director'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: DirectorViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.director.new',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.director.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: DirectorViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: DirectorResolver},
        data: {
          title: 'sa.director.edit',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.director.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
