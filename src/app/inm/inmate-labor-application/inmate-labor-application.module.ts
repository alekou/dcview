import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {inmateLaborApplicationRoutes} from './inmate-labor-application.routing';
import {InmateLaborApplicationListComponent} from './inmate-labor-application-list.component';
import {InmateLaborApplicationViewComponent} from './inmate-labor-application-view.component';
import {InmateLaborApplicationMassCreateComponent} from './inmate-labor-application-mass-create-component';
import {InmateLaborApplicationListDialogComponent} from './inmate-labor-application-list-dialog/inmate-labor-application-list-dialog.component';
import {InmateLaborApplicationRejectionDetailsDialogComponent} from './inmate-labor-application-rejection-details-dialog/inmate-labor-application-rejection-details-dialog.component';

@NgModule({
  declarations: [
    InmateLaborApplicationListComponent,
    InmateLaborApplicationViewComponent,
    InmateLaborApplicationMassCreateComponent,
    InmateLaborApplicationListDialogComponent,
    InmateLaborApplicationRejectionDetailsDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(inmateLaborApplicationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class InmateLaborApplicationModule {
}
