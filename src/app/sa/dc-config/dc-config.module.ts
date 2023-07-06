import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {DcConfigComponent} from './dc-config.component';
import {dcConfigRouting} from './dc-config.routing';

@NgModule({
  declarations: [
    DcConfigComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(dcConfigRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class DcConfigModule {
}
