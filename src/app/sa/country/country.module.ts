import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {countryRouting} from './country.routing';
import {CountryListComponent} from './country-list.component';
import {CountryViewComponent} from './country-view.component';

@NgModule({
  declarations: [
    CountryListComponent,
    CountryViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(countryRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class CountryModule {
}
