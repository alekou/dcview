import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {sessionTypeRouting} from './session-type.routing';
import {SessionTypeListComponent} from './session-type-list.component';
import {SessionTypeViewComponent} from './session-type-view.component';

@NgModule({
  declarations: [
    SessionTypeListComponent,
    SessionTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(sessionTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class SessionTypeModule {
}
