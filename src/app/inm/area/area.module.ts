import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {areaRoutes} from './area.routing';
import {AreaListComponent} from './area-list.component';
import {AreaViewComponent} from './area-view.component';

@NgModule({
  declarations: [
    AreaListComponent,
    AreaViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(areaRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class AreaModule {
}
