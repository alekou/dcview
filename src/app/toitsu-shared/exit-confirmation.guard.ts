import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuNavService} from '../toitsu-layout/toitsu-nav/toitsu-nav.service';

export interface ExitConfirmation {
  confirmExit: () => boolean | Observable<boolean>;
}

@Injectable({providedIn: 'root'})
export class ExitConfirmationGuard implements CanDeactivate<ExitConfirmation> {
  
  navigateAwaySelection: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private toitsuNavService: ToitsuNavService
  ) {}
  
  canDeactivate(component: ExitConfirmation): boolean | Observable<boolean> {
    
    if (!component.confirmExit()) {
      return true;
    }
    else {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.navigateAwaySelection.next(true);
        },
        reject: () => {
          this.navigateAwaySelection.next(false);
          this.toitsuNavService.setActiveMenu();
        }
      });
      
      return this.navigateAwaySelection;
    }
  }
}
