import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {LexicographyService} from './lexicography.service';
import {Lexicography} from './lexicography.model';

@Component({
  selector: 'app-sa-lexicography-list',
  templateUrl: 'lexicography-list.component.html'
})
export class LexicographyListComponent implements OnInit {
  lexicographies: Lexicography[];
  lexicographiesActiveIndex = -1;
  @ViewChild(NgForm) lexicographiesForm: NgForm;

  constructor(
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private lexicographyService: LexicographyService
  ) {
  }

  ngOnInit(): void {
    this.lexicographies = this.activatedRoute.snapshot.data['record'];
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.lexicographiesForm.dirty;
  }


  saveLexicographies() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.lexicographyService.saveLexicographies(this.lexicographies).subscribe({
      next: (responseData: Lexicography[]) => {
        this.toitsuToasterService.showSuccessStay();
        this.lexicographiesForm.form.markAsPristine();
        this.lexicographies = responseData;
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteLexicography(index, id) {

    if (!id) {
      this.lexicographies.splice(index, 1);
      this.lexicographiesActiveIndex = -1;
    } else {
      this.confirmationService.confirm({
          message: this.translate.instant('global.delete.confirmation'),
          accept: () => {
            this.toitsuToasterService.clearMessages();
            this.toitsuBlockUiService.blockUi();

            this.lexicographyService.deleteLexicography(id).subscribe({
              next: (responseData) => {
                this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
                this.lexicographies.splice(index, 1);
                this.lexicographiesActiveIndex = -1;
              },
              error: (responseError) => {
                this.toitsuToasterService.apiValidationErrors(responseError);
              }
            }).add(() => {
              this.toitsuBlockUiService.unblockUi();
            });
          }
        }
      );
    }
  }
  showLexicographiesTable = true;
  addLexicography() {
    this.showLexicographiesTable = false;

    let lexicography = new Lexicography();

    this.lexicographies.unshift(lexicography);

    setTimeout(() => {
      this.showLexicographiesTable = true;
    });
  }
}
