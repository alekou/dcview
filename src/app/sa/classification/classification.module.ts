import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {classificationRouting} from './classification.routing';
import {ClassificationListComponent} from './classification-list.component';
import {ClassificationViewComponent} from './classification-view.component';

@NgModule({
  declarations: [
    ClassificationListComponent,
    ClassificationViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(classificationRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class ClassificationModule {
}
