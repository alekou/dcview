import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {visitorRoutes} from './visitor.routing';
import {VisitorListComponent} from './visitor-list.component';
import {VisitorViewComponent} from './visitor-view.component';

@NgModule({
  declarations: [
    VisitorListComponent,
    VisitorViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(visitorRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VisitorModule {
}
