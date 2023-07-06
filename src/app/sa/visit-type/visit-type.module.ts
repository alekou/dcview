import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {visitTypeRouting} from './visit-type.routing';
import {VisitTypeListComponent} from './visit-type-list.component';
import {VisitTypeViewComponent} from './visit-type-view.component';

@NgModule({
  declarations: [
    VisitTypeListComponent,
    VisitTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(visitTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class VisitTypeModule {
}
