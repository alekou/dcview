import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {inmateRoutes} from './inmate.routing';
import {InmateListComponent} from './inmate-list.component';
import {InmateViewComponent} from './inmate-view.component';
import {InmateFolderComponent} from './inmate-folder.component';
import {InmateOldListComponent} from './inmate-old-list.component';
import {InmateOldViewComponent} from './inmate-old-view.component';
import {InmatePhotoListComponent} from './inmate-photo-list.component';
import {CloseInmateFolderDialogComponent} from './close-inmate-folder-dialog/close-inmate-folder-dialog.component';
import {CloseInmateRecordDialogComponent} from '../inmate-record/close-inmate-record-dialog/close-inmate-record-dialog.component';
import {ChangeCriminalStatusDialogComponent} from '../inmate-record/change-criminal-status-dialog/change-criminal-status-dialog.component';
import {ChangeCurrentJudgmentDialogComponent} from '../judgment/change-current-judgment-dialog/change-current-judgment-dialog.component';
import {MergeJudgmentsDialogComponent} from '../judgment/merge-judgments-dialog/merge-judgments-dialog.component';
import {UnmergeJudgmentDialogComponent} from '../judgment/unmerge-judgment-dialog/unmerge-judgment-dialog.component';
import {CancelJudgmentDialogComponent} from '../judgment/cancel-judgment-dialog/cancel-judgment-dialog.component';
import {RevertCancelledJudgmentDialogComponent} from '../judgment/revert-cancelled-judgment-dialog/revert-cancelled-judgment-dialog.component';
import {MoveBeneficialCalculationDialogComponent} from '../judgment/move-beneficial-calculation-dialog/move-beneficial-calculation-dialog.component';
import {InmatePhotoUploadDialogComponent} from '../inmate-photo/inmate-photo-view-panel/inmate-photo-upload-dialog/inmate-photo-upload-dialog.component';
import {InmatePhotoCaptureDialogComponent} from '../inmate-photo/inmate-photo-view-panel/inmate-photo-capture-dialog/inmate-photo-capture-dialog.component';
import {InmateRelativeListDialogComponent} from './inmate-relative-list-dialog/inmate-relative-list-dialog.component';
import {InmateRelativeViewDialogComponent} from './inmate-relative-view-dialog/inmate-relative-view-dialog.component';
import {InmateRelativesComponent} from '../visitor/inmate-relatives/inmate-relatives.component';

@NgModule({
  declarations: [
    InmateListComponent,
    InmateViewComponent,
    InmateFolderComponent,
    InmateOldListComponent,
    InmateOldViewComponent,
    InmatePhotoListComponent,
    
    CloseInmateFolderDialogComponent,
    CloseInmateRecordDialogComponent,
    ChangeCriminalStatusDialogComponent,
    ChangeCurrentJudgmentDialogComponent,
    MergeJudgmentsDialogComponent,
    UnmergeJudgmentDialogComponent,
    CancelJudgmentDialogComponent,
    RevertCancelledJudgmentDialogComponent,
    MoveBeneficialCalculationDialogComponent,
    InmatePhotoUploadDialogComponent,
    InmatePhotoCaptureDialogComponent,
    InmateRelativeListDialogComponent,
    InmateRelativeViewDialogComponent,
    InmateRelativesComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(inmateRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class InmateModule {
}
