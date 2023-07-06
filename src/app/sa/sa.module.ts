import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {saRoutes} from './sa.routing';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(saRoutes)
  ]
})
export class SaModule {
}
