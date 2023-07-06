import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {DcConfig} from './dc-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DcConfigService} from './dc-config.service';

@Component({
  selector: 'app-sa-dc-config',
  templateUrl: 'dc-config.component.html'
})
export class DcConfigComponent implements OnInit, ExitConfirmation {
  
  dcId: number;
  dcConfig: DcConfig;
  @ViewChild(NgForm) dcConfigForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private dcConfigService: DcConfigService
  ) {}
  
  ngOnInit() {
    
    // Get the record from the route resolver or initialize a new one
    this.dcConfig = this.route.snapshot.data['record'];
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.dcConfigForm.dirty;
  }

  saveDcConfig() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.dcConfigService.saveDcConfig(this.dcConfig).subscribe({
      next: (responseData: DcConfig) => {
        this.toitsuToasterService.showSuccessStay();
        this.dcConfigForm.form.markAsPristine();
        this.dcConfig = responseData;
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
