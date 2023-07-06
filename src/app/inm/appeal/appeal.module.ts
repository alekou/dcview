import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {appealRoutes} from './appeal.routing';
import {AppealListComponent} from './appeal-list.component';
import {AppealViewComponent} from './appeal-view.component';

@NgModule({
  declarations: [
    AppealListComponent,
    AppealViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(appealRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class AppealModule {
}
