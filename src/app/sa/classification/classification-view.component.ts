import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ClassificationService} from './classification.service';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {Classification} from './classification.model';
import {DisplayFieldRevisionsComponent} from '../../cm/display-field-revisions/display-field-revisions.component';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-sa-classification-view',
  templateUrl: 'classification-view.component.html'
})
export class ClassificationViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  classification: Classification;
  @ViewChild(NgForm) classificationForm: NgForm;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    public authService: AuthService,
    private classificationService: ClassificationService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {
  }
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.classification = this.id ? this.route.snapshot.data['record'] : new Classification();
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.classificationForm.dirty;
  }
  
  newRecord() {
    this.router.navigate(['/sa/classification/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/classification/list']);
  }
  
  saveClassification() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.classificationService.saveClassification(this.classification).subscribe({
      next: (responseData: Classification) => {
        this.toitsuToasterService.showSuccessStay();
        this.classificationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/classification/view', responseData.id]);
        } else {
          this.classification = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
        this.toitsuBlockUiService.unblockUi();
    });
  }
  displayFieldRevisions(entityClass, id) {
    this.toitsuBlockUiService.blockUi();

    const ref = this.dialogService.open(DisplayFieldRevisionsComponent, {
      data: {
        entity: entityClass,
        entityId : id
      },
      header: this.translate.instant('global.displayFieldRevisions'),
      width: '70%'
    });
    ref.onClose.subscribe(result => {
    });
    this.toitsuBlockUiService.unblockUi();
  }
}
