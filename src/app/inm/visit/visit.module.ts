import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {SelectVisitApplicationComponent} from '../visit-application/select-visit-application/select-visit-application.component';
import {ApprovedAndPendingVisitApplicationsDialogComponent} from '../visit-application/visit-application-list-dialog/approved-and-pending-visit-applications-dialog.component';
import {visitRoutes} from './visit.routing';
import {VisitListComponent} from './visit-list.component';
import {VisitViewComponent} from './visit-view.component';
import {VisitLawyerAddComponent} from './visit-lawyer-add.component';

@NgModule({
  declarations: [
    VisitListComponent,
    VisitViewComponent,
    VisitLawyerAddComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(visitRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    SelectVisitApplicationComponent,
    ApprovedAndPendingVisitApplicationsDialogComponent
  ]
})
export class VisitModule {
}
