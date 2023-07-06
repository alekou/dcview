import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {examinationRouting} from './examination.routing';
import {ExaminationListComponent} from './examination-list.component';
import {ExaminationViewComponent} from './examination-view.component';

@NgModule({
  declarations: [
    ExaminationListComponent,
    ExaminationViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(examinationRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class ExaminationModule {
}
