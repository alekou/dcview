import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {NgForm} from '@angular/forms';
import {EnumService} from '../../../cm/enum/enum.service';
import {GenParameterType} from '../gen-parameter-type.model';
import {GenParameterTypeService} from '../gen-parameter-type.service';

@Component({
  selector: 'app-cm-gen-parameter-type-view-dialog',
  templateUrl: 'gen-parameter-type-view-dialog.component.html'
})
export class GenParameterTypeViewDialogComponent implements OnInit{

  @ViewChild(NgForm) genParameterTypeForm: NgForm;
  genParameterType: GenParameterType = new GenParameterType();
  
  constructor(
    private genParameterTypeService: GenParameterTypeService,
    private enumService: EnumService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {
    this.genParameterType = this.dynamicDialogConfig.data['genParameterType'];
  }

  ngOnInit() {}
  
  saveGenParameterType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.genParameterTypeService.saveGenParameterType(this.genParameterType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      this.dynamicDialogRef.close(this.genParameterType);
    });
  }

  cancel() {
    if (this.genParameterTypeForm.dirty) {
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
}
