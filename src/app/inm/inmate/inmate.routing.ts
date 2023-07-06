import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {InmateListComponent} from './inmate-list.component';
import {InmateViewComponent} from './inmate-view.component';
import {InmateFolderComponent} from './inmate-folder.component';
import {InmateOldListComponent} from './inmate-old-list.component';
import {InmateOldViewComponent} from './inmate-old-view.component';
import {InmatePhotoListComponent} from './inmate-photo-list.component';
import {InmateResolver} from './inmate.resolver';
import {InmateFolderResolver} from './inmate-folder.resolver';
import {InmateOldResolver} from './inmate-old.resolver';

export const inmateRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: InmateListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmate',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate'}
          ],
          permissions: ['inm_inmate_index']
        }
      },
      {path: 'view', component: InmateViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.inmate.new',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate.new'}
          ],
          permissions: ['inm_inmate_create']
        }
      },
      {path: 'view/:id', component: InmateViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: InmateResolver},
        data: {
          title: 'inm.inmate.edit',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate.edit'}
          ],
          permissions: ['inm_inmate_update']
        }
      },
      {path: 'folder/:id', component: InmateFolderComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: InmateFolderResolver},
        data: {
          title: 'inm.inmate.folder',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate.folder'}
          ],
          permissions: ['inm_inmate_update']
        }
      },
      {path: 'oldlist', component: InmateOldListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmate.oldList',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate'},
            {label: 'inm.inmate.oldList'}
          ],
          permissions: ['inm_inmate_create']
        }
      },
      {path: 'oldview/:id', component: InmateOldViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: InmateOldResolver},
        data: {
          title: 'inm.inmate.oldView',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate'},
            {label: 'inm.inmate.oldView'}
          ],
          permissions: ['inm_inmate_create']
        }
      },
      {path: 'photolist', component: InmatePhotoListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.inmatePhoto.list',
          breadcrumbs: [
            {label: 'inm.group.secretariat'},
            {label: 'inm.inmate'},
            {label: 'inm.inmatePhoto'}
          ],
          permissions: ['inm_inmate_index']
        }
      },
      {path: '', loadChildren: () => import('../labor-catalog/labor-catalog.module').then(m => m.LaborCatalogModule)},
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
