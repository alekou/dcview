import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {EnumService} from '../../cm/enum/enum.service';
import {PostLetter} from './post-letter.model';
import {PostLetterService} from './post-letter.service';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-post-letter-view',
  templateUrl: 'post-letter-view.component.html'
})
export class PostLetterViewComponent implements OnInit {
  postLetter: PostLetter;
  inmateDialogUrl = inmateConsts.activeIndexUrl;
  id: number;
  containsMoney: boolean = false;
  
  @ViewChild(NgForm) postLetterForm: NgForm;
  postLetterTypes = [];
  
  args;
  
  constructor(private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              private toitsuSharedService: ToitsuSharedService,
              private postLetterService: PostLetterService,
              public authService: AuthService,
              private enumService: EnumService
  ) {
  }

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];
    // Get the record from the activatedRoute resolver or initialize a new one
    this.postLetter = this.id ? this.activatedRoute.snapshot.data['record'] : new PostLetter();

    
    // Post Letter Types
    this.enumService.getEnumValues('inm.core.enums.PostLetterType').subscribe(responseData => {
      this.postLetterTypes = responseData;
    });

    if (!this.id) {
      this.postLetter.type = 'UNREGISTERED';
    }

    if (this.postLetter.amountOfMoney != null) {
      this.containsMoney = true;
    }
    
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.postLetterForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/postletter/view']);
  }

  goToList() {
    this.router.navigate([ '/inm/postletter/list']);
  }

  savePostLetter() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    if (this.containsMoney === false){
      this.postLetter.amountOfMoney = null;
    }
    
    this.postLetterService.savePostLetter(this.postLetter).subscribe({
      next: (responseData: PostLetter) => {
        this.toitsuToasterService.showSuccessStay();
        this.postLetterForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/postletter/view', responseData.id]);
        }
        else {
          this.postLetter = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  deletePostLetter() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.postLetterService.deletePostLetter(this.postLetter.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.postLetterForm.form.markAsPristine();
            this.router.navigate(['/inm/postletter/list']);
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.postLetter.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }

  containsMoneyChanged() {
    this.postLetter.amountOfMoney = null;
  }
}
