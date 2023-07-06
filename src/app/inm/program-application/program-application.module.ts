import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {programApplicationRoutes} from './program-application.routing';
import {ProgramApplicationListComponent} from './program-application-list.component';
import {ProgramApplicationViewComponent} from './program-application-view.component';

@NgModule({
  declarations: [
    ProgramApplicationListComponent,
    ProgramApplicationViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(programApplicationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class ProgramApplicationModule {
}
