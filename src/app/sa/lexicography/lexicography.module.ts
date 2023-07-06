import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {LexicographyListComponent} from './lexicography-list.component';
import {lexicographyRouting} from './lexicography.routing';

@NgModule({
  declarations: [
    LexicographyListComponent,
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(lexicographyRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class LexicographyModule {
}
