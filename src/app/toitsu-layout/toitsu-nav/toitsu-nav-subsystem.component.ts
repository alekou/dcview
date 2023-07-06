import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {ToitsuNavService} from './toitsu-nav.service';

@Component({
  selector: 'app-toitsu-nav-subsystem',
  template: `
    <div class="subsystem-icon-container">
      <span app-toitsu-navitem *ngFor="let item of toitsuNavService.subsystemModel; let i = index;" [item]="item" pTooltip="{{item.tooltip}}" tooltipPosition="right">
      </span>
    </div>
  `
})
export class ToitsuNavSubsystemComponent implements OnInit {
  
  constructor(
    public app: AppComponent,
    public toitsuNavService: ToitsuNavService
  ) {}
  
  ngOnInit() {
    this.toitsuNavService.initializeSubsystemModel();
  }
}
