import {Routes} from '@angular/router';
import {AuthGuard} from '../../toitsu-auth/auth.guard';
import {ExitConfirmationGuard} from '../../toitsu-shared/exit-confirmation.guard';
import {LaborDayListComponent} from './labor-day-list.component';
import {LaborDayViewComponent} from './labor-day-view.component';
import {LaborDayAddNormalComponent} from './labor-day-add-normal.component';
import {LaborDayAddSpecialComponent} from './labor-day-add-special.component';
import {LaborDayResolver} from './labor-day.resolver';

export const laborDayRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {
    path: '',
    children: [
      {path: 'list', component: LaborDayListComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.laborDay',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborDay'}
          ],
          permissions: ['inm_laborday_index']
        }
      },
      {path: 'view', component: LaborDayViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        data: {
          title: 'inm.laborDay.new',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborDay.new'}
          ],
          permissions: ['inm_laborday_create']
        }
      },
      {path: 'view/:id', component: LaborDayViewComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmationGuard],
        resolve: {record: LaborDayResolver},
        data: {
          title: 'inm.laborDay.edit',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborDay.edit'}
          ],
          permissions: ['inm_laborday_update']
        }
      },
      {path: 'addnormal', component: LaborDayAddNormalComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.laborDay.addNormal.title',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborDay.add'},
            {label: 'inm.laborDay.add.normal'}
          ],
          permissions: ['inm_laborday_create']
        }
      },
      {path: 'addspecial', component: LaborDayAddSpecialComponent, canActivate: [AuthGuard],
        data: {
          title: 'inm.laborDay.addSpecial.title',
          breadcrumbs: [
            {label: 'inm.group.labor'},
            {label: 'inm.laborDay.add'},
            {label: 'inm.laborDay.add.special'}
          ],
          permissions: ['inm_laborday_create']
        }
      }
    ]
  }
  // -------------------------------------------------------------------------------------------------------------------
];
