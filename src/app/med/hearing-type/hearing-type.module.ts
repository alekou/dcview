import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {hearingTypeRouting} from './hearing-type.routing';
import {HearingTypeListComponent} from './hearing-type-list.component';
import {HearingTypeViewComponent} from './hearing-type-view.component';

@NgModule({
  declarations: [
    HearingTypeListComponent,
    HearingTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(hearingTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class HearingTypeModule {
}
