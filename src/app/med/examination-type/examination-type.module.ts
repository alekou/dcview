import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {examinationTypeRouting} from './examination-type.routing';
import {ExaminationTypeListComponent} from './examination-type-list.component';
import {ExaminationTypeViewComponent} from './examination-type-view.component';

@NgModule({
  declarations: [
    ExaminationTypeListComponent,
    ExaminationTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(examinationTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class ExaminationTypeModule {
}
