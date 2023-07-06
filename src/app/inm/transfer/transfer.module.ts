import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {transferRoutes} from './transfer.routing';
import {TransferListComponent} from './transfer-list.component';
import {TransferViewComponent} from './transfer-view.component';
import {TransferInProgressComponent} from './transfer-in-progress.component';
import {CompleteTransferWithInabilityDialogComponent} from './complete-transfer-with-inability-dialog/complete-transfer-with-inability-dialog.component';

@NgModule({
  declarations: [
    TransferListComponent,
    TransferViewComponent,
    TransferInProgressComponent,
    CompleteTransferWithInabilityDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(transferRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class TransferModule {
}
