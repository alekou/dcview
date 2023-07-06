import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {NgForm} from '@angular/forms';
import {EnumService} from '../../../cm/enum/enum.service';
import {GenParameter} from '../gen-parameter.model';
import {GenParameterService} from '../gen-parameter.service';
import {GenParameterTypeService} from '../../gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../../gen-parameter-type/gen-parameter-type.model';
import {GenParameterListDialogComponent} from '../gen-parameter-list-dialog/gen-parameter-list-dialog.component';
import {genParameterConsts} from '../gen-parameter.consts';
import {GenParameterCategory} from '../gen-parameter.category';

@Component({
  selector: 'app-cm-gen-parameter-view-dialog',
  templateUrl: 'gen-parameter-view-dialog.component.html'
})
export class GenParameterViewDialogComponent implements OnInit{

  @ViewChild(NgForm) genParameterForm: NgForm;
  genParameter;
  genParameterType;
  category: string;
  genParameterDescription: string;
  isHierarchical: boolean = false;
  genParameterCategories = [];
  
  // Λίστα με τα υποψήφια παραμετρικά για ανωτεροβάθμια κατηγορία
  retrievedGenParameters = [];
  hideCheckBox: boolean = false;
  constructor(
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private enumService: EnumService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {
    this.genParameter = this.dynamicDialogConfig.data['genParameter'];
    this.category = this.dynamicDialogConfig.data['category'];
    this.isHierarchical = this.dynamicDialogConfig.data['isHierarchical'];
    this.genParameterDescription = this.dynamicDialogConfig.data['genParameterDescription'];
    this.hideCheckBox = this.dynamicDialogConfig.data['hideCheckBox'];
  }

  ngOnInit() {
    this.genParameterTypeService.getAllGenParameterTypes().subscribe(responseData => {
      this.genParameterCategories = responseData;
    });
    
    if (this.category || this.genParameter.parentId) {
      this.genParameter.category = this.category;
      let category = GenParameterCategory[this.genParameter.category];
      this.genParameterService.getByCategoryAndSelectable(category, true, false, [this.genParameter.parentId]).subscribe(responseData => {
        this.retrievedGenParameters = responseData;
      });
    }
  }
  
  saveGenParameter() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    // Αφαίρεση των πεδίων που έρχονται στο indexDto.
    if (this.genParameter.genParameterTypeDescription) {
      delete this.genParameter.genParameterTypeDescription;
    }
    if (this.genParameter.genParameterTypeIsEditable) {
      delete this.genParameter.genParameterTypeIsEditable;
    }
    if (this.genParameter.isActiveLabel) {
      delete this.genParameter.isActiveLabel;
    }
    this.genParameterService.saveGenParameter(this.genParameter).subscribe({
      next: (responseData: GenParameter) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close(responseData);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  cancel() {
    if (this.genParameterForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {
          
        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }
  parameterCategoryChanged() {
    this.genParameterTypeService.getGenParameterTypeByCategory(this.genParameter.category).subscribe((responseData: GenParameterType) => {
     if (responseData) {
       this.isHierarchical = responseData.isHierarchical;
       this.category = responseData.category;
       this.genParameterDescription = responseData.description;
       this.genParameterType = responseData;
     }
    });
    let category = GenParameterCategory[this.genParameter.category];
    this.genParameterService.getByCategoryAndSelectable(category, true, false, [this.genParameter.parentId]).subscribe(responseData => {
      this.retrievedGenParameters = responseData;
    });
  }
  openListDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(GenParameterListDialogComponent, {
      header: this.genParameterDescription,
      width: '85%',
      data: {
        dialogUrl: genParameterConsts.indexUrl,
        category: this.category,
        isHierarchical: this.genParameterType.isHierarchical,
        isBigList: this.genParameterType.isBigList
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.genParameter.parentId = result.id;
      }
    });
  }
  
  genParameterParentChanged() {
    const foundGenParameter = this.retrievedGenParameters.find(genParameter => {
      return genParameter.id === this.genParameter.parentId;
    });
    if (foundGenParameter && foundGenParameter.isNotSelectable) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('error.genParameterNotSelectable'));
      this.genParameter.parentId = null;
    } 
  }
}
