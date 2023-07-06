import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {TemplateListComponent} from './template-list.component';
import {TemplateViewComponent} from './template-view.component';
import {TemplateResolver} from './template.resolver';


export const templateRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: TemplateListComponent, canActivate: [AuthGuard],
        data: {
          title: 'sa.template',
          breadcrumbs: [
            {label: 'sa.template'}
          ],
          permissions: []
        }
      },
      {path: 'view', component: TemplateViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'sa.programType.new',
          breadcrumbs: [
            {label: 'sa.template'},
            {label: 'sa.template.new'}
          ],
          permissions: []
        }
      },
      {path: 'view/:id', component: TemplateViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: TemplateResolver},
        data: {
          title: 'sa.template.edit',
          breadcrumbs: [
            {label: 'sa.template'},
            {label: 'sa.template.edit'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
