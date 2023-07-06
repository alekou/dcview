import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {TemplateViewComponent} from './template-view.component';
import {TemplateListComponent} from './template-list.component';
import {templateRouting} from './template.routing';

@NgModule({
  declarations: [
    TemplateListComponent,
    TemplateViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(templateRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class TemplateModule {
}
