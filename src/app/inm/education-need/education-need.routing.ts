import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {EducationNeedListComponent} from './education-need-list.component';
import {EducationNeedViewComponent} from './education-need-view.component';
import {EducationNeedNewResolver} from './education-need-new.resolver';
import {EducationNeedResolver} from './education-need.resolver';

export const educationNeedRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: EducationNeedListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.educationNeed',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.educationNeed'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: EducationNeedViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: EducationNeedNewResolver},
        data: {
          title: 'inm.educationNeed.new',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.educationNeed.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: EducationNeedViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: EducationNeedResolver},
        data: {
          title: 'inm.educationNeed.edit',
          breadcrumbs: [
            {label: 'inm.group.service'},
            {label: 'inm.educationNeed.edit'}
          ],
          permissions: []
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
