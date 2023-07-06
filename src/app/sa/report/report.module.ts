import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';

import {ReportViewComponent} from './report-view.component';
import {ReportCreateComponent} from './report-create.component';
import {reportRouting} from './report.routing';

@NgModule({
  declarations: [
    ReportViewComponent,
    ReportCreateComponent
  ],
  exports: [
    ReportViewComponent,
    ReportCreateComponent
  ],
  imports: [
    RouterModule.forChild(reportRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class ReportModule {
}
