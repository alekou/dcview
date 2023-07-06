import {NgModule} from '@angular/core';
import {ToitsuSharedModule} from '../toitsu-shared/toitsu-shared.module';
import {RecordDcOriginComponent} from './record-dc-origin/record-dc-origin.component';
import {OtherDcNameComponent} from './other-dc-name/other-dc-name.component';
import {SelectInmateComponent} from '../inm/inmate/select-inmate/select-inmate.component';
import {InmateListDialogComponent} from '../inm/inmate/inmate-list-dialog/inmate-list-dialog.component';
import {InmatePhotoDisplayCurrentDialogComponent} from '../inm/inmate-photo/inmate-photo-display-current-dialog/inmate-photo-display-current-dialog.component';
import {SelectGenParameterComponent} from '../sa/gen-parameter/select-gen-parameter/select-gen-parameter.component';
import {GenParameterListDialogComponent} from '../sa/gen-parameter/gen-parameter-list-dialog/gen-parameter-list-dialog.component';
import {GenParameterViewDialogComponent} from '../sa/gen-parameter/gen-parameter-view-dialog/gen-parameter-view-dialog.component';
import {DocumentsComponent} from '../cm/document/documents/documents.component';
import {DocumentUploadDialogComponent} from '../cm/document/document-upload-dialog/document-upload-dialog.component';
import {DocumentPreviewDialogComponent} from '../cm/document/document-preview-dialog/document-preview-dialog.component';
import {SelectVisitorComponent} from '../inm/visitor/select-visitor/select-visitor.component.';
import {VisitorListDialogComponent} from '../inm/visitor/visitor-list-dialog/visitor-list-dialog.component';
import {VisitorViewDialogComponent} from '../inm/visitor/visitor-view-dialog/visitor-view-dialog.component';
import {SelectCourthouseComponent} from '../sa/courthouse/select-courthouse/select-courthouse.component';
import {CourthouseListDialogComponent} from '../sa/courthouse/courthouse-list-dialog/courthouse-list-dialog.component';
import {TemplateButtonComponent} from '../sa/template/template-button/template-button.component';
import {TemplateListDialogComponent} from '../sa/template/template-list-dialog/template-list-dialog.component';
import {DisplayFieldRevisionsComponent} from '../cm/display-field-revisions/display-field-revisions.component';
import {FieldRevisionsComponent} from '../cm/display-field-revisions/field-revisions/field-revisions.component';
import {InmatePhotoViewPanelComponent} from '../inm/inmate-photo/inmate-photo-view-panel/inmate-photo-view-panel.component';
import {BadgeModule} from 'primeng/badge';

@NgModule({
  declarations: [
    RecordDcOriginComponent,
    OtherDcNameComponent,
    
    SelectInmateComponent,
    InmateListDialogComponent,

    InmatePhotoDisplayCurrentDialogComponent,
    InmatePhotoViewPanelComponent,
    
    SelectGenParameterComponent,
    GenParameterListDialogComponent,
    GenParameterViewDialogComponent,
    
    DocumentsComponent,
    DocumentUploadDialogComponent,
    DocumentPreviewDialogComponent,
    
    SelectVisitorComponent,
    VisitorListDialogComponent,
    VisitorViewDialogComponent,
    
    SelectCourthouseComponent,
    CourthouseListDialogComponent,
    
    TemplateButtonComponent,
    TemplateListDialogComponent,
    
    FieldRevisionsComponent,
    DisplayFieldRevisionsComponent
  ],
  imports: [
    ToitsuSharedModule,
    BadgeModule
  ],
  exports: [
    RecordDcOriginComponent,
    OtherDcNameComponent,
    
    SelectInmateComponent,
    InmateListDialogComponent,

    InmatePhotoDisplayCurrentDialogComponent,
    InmatePhotoViewPanelComponent,
    
    SelectGenParameterComponent,
    GenParameterListDialogComponent,
    GenParameterViewDialogComponent,
    
    DocumentsComponent,
    DocumentUploadDialogComponent,
    DocumentPreviewDialogComponent,
    
    SelectVisitorComponent,
    VisitorListDialogComponent,
    VisitorViewDialogComponent,
    
    SelectCourthouseComponent,
    CourthouseListDialogComponent,
    
    TemplateButtonComponent,
    TemplateListDialogComponent,

    FieldRevisionsComponent,
    DisplayFieldRevisionsComponent
  ]
})
export class GeneralSharedModule {
}
