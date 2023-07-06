import {Routes} from '@angular/router';

import {IndexComponent} from './toitsu-layout/index/index.component';
import {Toitsu401Component} from './toitsu-shared/toitsu-401/toitsu-401.component';
import {Toitsu403Component} from './toitsu-shared/toitsu-403/toitsu-403.component';

export const appRoutes: Routes = [
  {path: '', component: IndexComponent},
  {path: '401', component: Toitsu401Component, data: {title: 'global.error.401.title'}},
  {path: '403', component: Toitsu403Component, data: {title: 'global.error.403.title'}},
  {path: 'inm', loadChildren: () => import('./inm/inm.module').then(m => m.InmModule)},
  {path: 'med', loadChildren: () => import('./med/med.module').then(m => m.MedModule)},
  {path: 'sa', loadChildren: () => import('./sa/sa.module').then(m => m.SaModule)},
  {path: '**', redirectTo: ''}
];

export class AppRoutingModule {
}
