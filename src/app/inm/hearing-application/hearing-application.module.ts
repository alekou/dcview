import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {inmHearingApplicationRoutes} from './hearing-application.routing';
import {HearingApplicationListComponent} from '../../med/hearing-application/hearing-application-list.component';
import {HearingApplicationViewComponent} from '../../med/hearing-application/hearing-application-view.component';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(inmHearingApplicationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    HearingApplicationListComponent,
    HearingApplicationViewComponent
  ]
})
export class InmHearingApplicationModule {
}
