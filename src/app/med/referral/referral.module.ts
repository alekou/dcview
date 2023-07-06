import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {referralRouting} from './referral.routing';
import {ReferralListComponent} from './referral-list.component';
import {ReferralViewComponent} from './referral-view.component';


@NgModule({
  declarations: [
    ReferralListComponent,
    ReferralViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(referralRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class ReferralModule {
}
