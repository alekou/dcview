import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {courthouseRouting} from './courthouse.routing';
import {CourthouseListComponent} from './courthouse-list.component';
import {CourthouseViewComponent} from './courthouse-view.component';

@NgModule({
  declarations: [
    CourthouseListComponent,
    CourthouseViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(courthouseRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class CourthouseModule {
}
