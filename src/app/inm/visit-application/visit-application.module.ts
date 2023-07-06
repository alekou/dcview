import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {visitApplicationRoutes} from './visit-application.routing';
import {VisitApplicationListComponent} from './visit-application-list.component';
import {VisitApplicationViewComponent} from './visit-application-view.component';

@NgModule({
  declarations: [
    VisitApplicationListComponent,
    VisitApplicationViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(visitApplicationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VisitApplicationModule {
}
