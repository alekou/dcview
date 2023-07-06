import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {policeDepartmentRouting} from './police-department.routing';
import {PoliceDepartmentListComponent} from './police-department-list.component';
import {PoliceDepartmentViewComponent} from './police-department-view.component';

@NgModule({
  declarations: [
    PoliceDepartmentListComponent,
    PoliceDepartmentViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(policeDepartmentRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class PoliceDepartmentModule {
}
