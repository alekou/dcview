import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {VaccinationViewDialogComponent} from '../vaccination/vaccination-view-dialog/vaccination-view-dialog.component';
import {TreatmentViewDialogComponent} from '../treatment/treatment-view-dialog/treatment-view-dialog.component';
import {ExaminationTypeListDialogComponent} from '../examination-type/examination-type-list-dialog/examination-type-list-dialog.component';
import {ExaminationViewDialogComponent} from '../examination/examination-view-dialog/examination-view-dialog.component';
import {DiseaseViewDialogComponent} from '../disease/disease-view-dialog/disease-view-dialog.component';
import {BloodSamplingViewDialogComponent} from '../blood-sampling/blood-sampling-view-dialog/blood-sampling-view-dialog.component';
import {hearingRouting} from './hearing.routing';
import {HearingListComponent} from './hearing-list.component';
import {HearingViewComponent} from './hearing-view.component';

@NgModule({
  declarations: [
    HearingListComponent,
    HearingViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(hearingRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
    VaccinationViewDialogComponent,
    TreatmentViewDialogComponent,
    ExaminationTypeListDialogComponent,
    ExaminationViewDialogComponent,
    DiseaseViewDialogComponent,
    BloodSamplingViewDialogComponent
  ]
})
export class HearingModule {
}
