import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {LexicographyListComponent} from './lexicography-list.component';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {LexicographyResolver} from './lexicography.resolver';


export const lexicographyRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: LexicographyListComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: LexicographyResolver},
        data: {
          title: 'sa.lexicography',
          breadcrumbs: [
            {label: 'sa.group.params'},
            {label: 'sa.lexicography'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
