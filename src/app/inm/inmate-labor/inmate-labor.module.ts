import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {inmateLaborRoutes} from './inmate-labor.routing';
import {InmateLaborListComponent} from './inmate-labor-list.component';
import {InmateLaborViewComponent} from './inmate-labor-view.component';

@NgModule({
  declarations: [
    InmateLaborListComponent,
    InmateLaborViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(inmateLaborRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class InmateLaborModule {
}
