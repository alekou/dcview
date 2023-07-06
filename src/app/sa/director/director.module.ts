import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {directorRouting} from './director.routing';
import {DirectorListComponent} from './director-list.component';
import {DirectorViewComponent} from './director-view.component';

@NgModule({
  declarations: [
    DirectorListComponent,
    DirectorViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(directorRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class DirectorModule {
}
