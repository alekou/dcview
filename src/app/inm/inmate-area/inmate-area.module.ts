import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TreeModule} from 'primeng/tree';
import {inmateAreaRoutes} from './inmate-area.routing';
import {InmateAreaManageComponent} from './inmate-area-manage.component';
import {InmateAreaHistoryComponent} from './inmate-area-history.component';
import {InmateAreaCatalogComponent} from './inmate-area-catalog.component';
import {InmateAreaMoveDialogComponent} from './inmate-area-move-dialog/inmate-area-move-dialog.component';
import {InmateAreaEditDialogComponent} from './inmate-area-edit-dialog/inmate-area-edit-dialog.component';
import {InmateAreaSetInactiveDialogComponent} from './inmate-area-set-inactive-dialog/inmate-area-set-inactive-dialog.component';

@NgModule({
  declarations: [
    InmateAreaManageComponent,
    InmateAreaHistoryComponent,
    InmateAreaCatalogComponent,
    InmateAreaMoveDialogComponent,
    InmateAreaEditDialogComponent,
    InmateAreaSetInactiveDialogComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(inmateAreaRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,

    OverlayPanelModule,
    SelectButtonModule,
    ToolbarModule,
    TreeModule
  ]
})
export class InmateAreaModule {
}
