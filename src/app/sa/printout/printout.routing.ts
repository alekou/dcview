import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {PrintoutComponent} from './printout.component';

export const printoutRouting: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {
        path: 'secretary', component: PrintoutComponent, canActivate: [AuthGuard],
        data: {
          title: 'secretary.printout',
          breadcrumbs: [
            {label: 'secretary.printout'},
          ],
          permissions: []
        }
      },
      {
        path: 'transfer', component: PrintoutComponent, canActivate: [AuthGuard],
        data: {
          title: 'transfer.printout',
          breadcrumbs: [
            {label: 'transfer.printout'}
          ],
          permissions: []
        }
      },
      {
        path: 'labor', component: PrintoutComponent, canActivate: [AuthGuard],
        data: {
          title: 'labor.printout',
          breadcrumbs: [
            {label: 'labor.printout'}
          ],
          permissions: []
        }
      },
      {
        path: 'warden', component: PrintoutComponent, canActivate: [AuthGuard],
        data: {
          title: 'warden.printout',
          breadcrumbs: [
            {label: 'warden.printout'}
          ],
          permissions: []
        }
      },
      {
        path: 'medical', component: PrintoutComponent, canActivate: [AuthGuard],
        data: {
          title: 'medical.printout',
          breadcrumbs: [
            {label: 'medical.printout'}
          ],
          permissions: []
        }
      }
    ]
  },
  // -------------------------------------------------------------------------------------------------------------------
];
