import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {doctorSessionRoutes} from './doctor-session.routing';
import {DoctorSessionListComponent} from './doctor-session-list.component';
import {DoctorSessionViewComponent} from './doctor-session-view.component';

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
