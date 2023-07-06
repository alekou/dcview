import {Component, OnDestroy} from '@angular/core';
import {ToitsuBreadcrumbService} from './toitsu-breadcrumb.service';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-toitsu-breadcrumb',
  templateUrl: './toitsu-breadcrumb.component.html'
})
export class ToitsuBreadcrumbComponent implements OnDestroy {
  
  subscription: Subscription;
  
  items: MenuItem[];
  
  constructor(public toitsuBreadcrumbService: ToitsuBreadcrumbService) {
    this.subscription = toitsuBreadcrumbService.itemsHandler.subscribe(response => {
      this.items = response;
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
