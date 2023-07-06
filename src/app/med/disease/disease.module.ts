import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {diseaseRouting} from './disease.routing';
import {DiseaseListComponent} from './disease-list.component';
import {DiseaseViewComponent} from './disease-view.component';

@NgModule({
  declarations: [
    DiseaseListComponent,
    DiseaseViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(diseaseRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class DiseaseModule {
}
