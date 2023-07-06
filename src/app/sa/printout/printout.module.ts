import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {printoutRouting} from './printout.routing';
import {PrintoutComponent} from './printout.component';

@NgModule({
  declarations: [
   PrintoutComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(printoutRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class PrintoutModule {
}
