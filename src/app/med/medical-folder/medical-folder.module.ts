import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {VaccinationViewDialogComponent} from '../vaccination/vaccination-view-dialog/vaccination-view-dialog.component';
import {TreatmentViewDialogComponent} from '../treatment/treatment-view-dialog/treatment-view-dialog.component';
import {ExaminationViewDialogComponent} from '../examination/examination-view-dialog/examination-view-dialog.component';
import {DoctorInmateViewDialogComponent} from '../doctor-inmate/doctor-inmate-view-dialog.component';
import {DiseaseViewDialogComponent} from '../disease/disease-view-dialog/disease-view-dialog.component';
import {BloodSamplingViewDialogComponent} from '../blood-sampling/blood-sampling-view-dialog/blood-sampling-view-dialog.component';
import {medicalFolderRouting} from './medical-folder.routing';
import {MedicalFolderListComponent} from './medical-folder-list.component';
import {MedicalFolderViewComponent} from './medical-folder-view.component';

@NgModule({
  declarations: [
    MedicalFolderListComponent,
    MedicalFolderViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(medicalFolderRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
    VaccinationViewDialogComponent,
    TreatmentViewDialogComponent,
    ExaminationViewDialogComponent,
    DoctorInmateViewDialogComponent,
    DiseaseViewDialogComponent,
    BloodSamplingViewDialogComponent
  ]
})
export class MedicalFolderModule {
}
