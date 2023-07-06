import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {PostLetterListComponent} from './post-letter-list.component';
import {PostLetterViewComponent} from './post-letter-view.component';
import {PostLetterResolver} from './post-letter.resolver';

export const postLetterRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: PostLetterListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.postLetter',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.postLetter'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: PostLetterViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.postLetter.new',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.postLetter.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: PostLetterViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: PostLetterResolver},
        data: {
          title: 'inm.postLetter.edit',
          breadcrumbs: [
            {label: 'inm.group.warden'},
            {label: 'inm.postLetter.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
