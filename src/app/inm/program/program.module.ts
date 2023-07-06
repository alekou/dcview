import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {ProgramApplicationListDialogComponent} from '../program-application/program-application-list-dialog/program-application-list-dialog.component';
import {ProgramApplicationRejectionDetailsDialogComponent} from '../program-application/program-application-rejection-details-dialog/program-application-rejection-details-dialog.component';
import {ProgramApplicationWithdrawalDetailsDialogComponent} from '../program-application/program-application-withdrawal-details-dialog/program-application-withdrawal-details-dialog.component';
import {programRoutes} from './program.routing';
import {ProgramListComponent} from './program-list.component';
import {ProgramViewComponent} from './program-view.component';
import {ProgramConductListComponent} from './program-conduct-list.component';
import {ProgramConductViewComponent} from './program-conduct-view.component';

@NgModule({
  declarations: [
    ProgramListComponent,
    ProgramViewComponent,
    ProgramConductListComponent,
    ProgramConductViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(programRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    ProgramApplicationListDialogComponent,
    ProgramApplicationRejectionDetailsDialogComponent,
    ProgramApplicationWithdrawalDetailsDialogComponent
  ]
})
export class ProgramModule {
}
