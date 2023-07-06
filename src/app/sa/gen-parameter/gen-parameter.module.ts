import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {genParameterRouting} from './gen-parameter.routing';
import {GenParameterListComponent} from './gen-parameter-list.component';

@NgModule({
  declarations: [
    GenParameterListComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(genParameterRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class GenParameterModule {
}
