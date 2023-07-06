import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {genParameterTypeRouting} from './gen-parameter-type.routing';
import {GenParameterTypeListComponent} from './gen-parameter-type-list.component';
import {GenParameterTypeViewDialogComponent} from './gen-parameter-type-view-dialog/gen-parameter-type-view-dialog.component';

@NgModule({
  declarations: [
    GenParameterTypeListComponent,
    GenParameterTypeViewDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(genParameterTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class GenParameterTypeModule {
}
