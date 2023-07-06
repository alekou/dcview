import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {visitProgramRoutes} from './visit-program.routing';
import {VisitProgramListComponent} from './visit-program-list.component';
import {VisitProgramViewComponent} from './visit-program-view.component';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    VisitProgramListComponent,
    VisitProgramViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(visitProgramRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ],
  providers: [DatePipe]
})
export class VisitProgramModule {
}
