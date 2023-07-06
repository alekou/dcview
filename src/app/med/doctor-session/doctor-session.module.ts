import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {doctorSessionRoutes} from './doctor-session.routing';
import {DoctorSessionViewComponent} from '../../inm/doctor-session/doctor-session-view.component';
import {DoctorSessionListComponent} from '../../inm/doctor-session/doctor-session-list.component';


@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(doctorSessionRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    DoctorSessionListComponent,
    DoctorSessionViewComponent
  ]
})
export class DoctorSessionModule {
}
