import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {medicineRouting} from './medicine.routing';
import {MedicineListComponent} from './medicine-list.component';
import {MedicineViewComponent} from './medicine-view.component';

@NgModule({
  declarations: [
    MedicineListComponent,
    MedicineViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(medicineRouting),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class MedicineModule {
}
