import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {ProgramApplicationListDialogComponent} from '../program-application/program-application-list-dialog/program-application-list-dialog.component';
import {ProgramApplicationRejectionDetailsDialogComponent} from '../program-application/program-application-rejection-details-dialog/program-application-rejection-details-dialog.component';
import {ProgramApplicationWithdrawalDetailsDialogComponent} from '../program-application/program-application-withdrawal-details-dialog/program-application-withdrawal-details-dialog.component';
import {programProtocolRoutes} from './program-protocol.routing';
import {ProgramProtocolListComponent} from './program-protocol-list.component';
import {ProgramProtocolViewComponent} from './program-protocol-view.component';

@NgModule({
  declarations: [
    ProgramProtocolListComponent,
    ProgramProtocolViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(programProtocolRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    ProgramApplicationListDialogComponent,
    ProgramApplicationRejectionDetailsDialogComponent,
    ProgramApplicationWithdrawalDetailsDialogComponent
  ]
})
export class ProgramProtocolModule {
}
