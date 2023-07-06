import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {laborCatalogRoutes} from './labor-catalog.routing';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {LaborCatalogComponent} from './labor-catalog.component';
import {LaborCatalogLaborDayListComponent} from './labor-catalog-labor-day-list.component';
import {LaborCatalogJudgmentListComponent} from './labor-catalog-judgment-list.component';
import {LaborCatalogInmateLaborListComponent} from './labor-catalog-inmate-labor-list.component';
import {LaborCatalogCalendarListComponent} from './labor-catalog-calendar-list.component';
import {LaborCatalogExcerptListComponent} from './labor-catalog-excerpt-list.component';

@NgModule({
  declarations: [
    LaborCatalogComponent,
    LaborCatalogLaborDayListComponent,
    LaborCatalogJudgmentListComponent,
    LaborCatalogInmateLaborListComponent,
    LaborCatalogExcerptListComponent,
    LaborCatalogCalendarListComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(laborCatalogRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class LaborCatalogModule {
}
