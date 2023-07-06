import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {hospitalRouting} from './hospital.routing';
import {HospitalListComponent} from './hospital-list.component';
import {HospitalViewComponent} from './hospital-view.component';

@NgModule({
  declarations: [
    HospitalListComponent,
    HospitalViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(hospitalRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class HospitalModule {
}
