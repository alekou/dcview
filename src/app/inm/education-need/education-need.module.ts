import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {educationNeedRoutes} from './education-need.routing';
import {EducationNeedListComponent} from './education-need-list.component';
import {EducationNeedViewComponent} from './education-need-view.component';

@NgModule({
  declarations: [
    EducationNeedListComponent,
    EducationNeedViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(educationNeedRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class EducationNeedModule {
}
