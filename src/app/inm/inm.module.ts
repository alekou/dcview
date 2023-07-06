import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {inmRoutes} from './inm.routing';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(inmRoutes)
  ]
})
export class InmModule {
}
