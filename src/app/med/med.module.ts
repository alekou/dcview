import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {medRoutes} from './med.routing';

@NgModule({
    declarations: [],
    exports: [],
    imports: [
        RouterModule.forChild(medRoutes)
    ]
})
export class MedModule {
}
