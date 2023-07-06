import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {programTypeRouting} from './program-type.routing';
import {ProgramTypeListComponent} from './program-type-list.component';
import {ProgramTypeViewComponent} from './program-type-view.component';

@NgModule({
  declarations: [
    ProgramTypeListComponent,
    ProgramTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(programTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class ProgramTypeModule {
}
