import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {diseaseTypeRouting} from './disease-type.routing';
import {DiseaseTypeListComponent} from './disease-type-list.component';
import {DiseaseTypeViewComponent} from './disease-type-view.component';

@NgModule({
  declarations: [
    DiseaseTypeListComponent,
    DiseaseTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(diseaseTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class DiseaseTypeModule {
}
