import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {areaTypeRouting} from './area-type.routing';
import {AreaTypeListComponent} from './area-type-list.component';
import {AreaTypeViewComponent} from './area-type-view.component';

@NgModule({
  declarations: [
    AreaTypeListComponent,
    AreaTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(areaTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class AreaTypeModule {
}
