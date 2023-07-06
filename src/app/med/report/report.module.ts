import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';


import {reportRouting} from './report.routing';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(reportRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class ReportModule {
}
