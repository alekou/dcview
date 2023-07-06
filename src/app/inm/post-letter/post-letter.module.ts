import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {postLetterRoutes} from './post-letter.routing';
import {PostLetterListComponent} from './post-letter-list.component';
import {PostLetterViewComponent} from './post-letter-view.component';

@NgModule({
  declarations: [
    PostLetterListComponent,
    PostLetterViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(postLetterRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class PostLetterModule {
}
