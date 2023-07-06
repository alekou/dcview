import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {shiftRouting} from './shift.routing';
import {ShiftListComponent} from './shift-list.component';
import {ShiftViewComponent} from './shift-view.component';

@NgModule({
  declarations: [
    ShiftListComponent,
    ShiftViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(shiftRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class ShiftModule {
}
