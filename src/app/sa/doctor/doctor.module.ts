import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {doctorRouting} from './doctor.routing';
import {DoctorListComponent} from './doctor-list.component';
import {DoctorViewComponent} from './doctor-view.component';

@NgModule({
  declarations: [
    DoctorListComponent,
    DoctorViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(doctorRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class DoctorModule {
}
