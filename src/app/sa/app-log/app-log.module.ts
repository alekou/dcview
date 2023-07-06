import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {appLogRouting} from './app-log.routing';
import {AppLogListComponent} from './app-log-list.component';
import {AppLogDisplayJsonDialogComponent} from './app-log-display-json-dialog/app-log-display-json-dialog.component';


@NgModule({
  declarations: [
    AppLogListComponent,
    AppLogDisplayJsonDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(appLogRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class AppLogModule {
}
