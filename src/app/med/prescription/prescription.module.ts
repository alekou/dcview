import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {TreatmentLineListDialogComponent} from '../treatment-line/treatment-line-list-dialog.component.';
import {prescriptionRouting} from './prescription.routing';
import {PrescriptionListComponent} from './prescription-list.component';
import {PrescriptionViewComponent} from './prescription-view.component';

@NgModule({
  declarations: [
    PrescriptionListComponent,
    PrescriptionViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(prescriptionRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
    TreatmentLineListDialogComponent
  ]
})
export class PrescriptionModule {
}
