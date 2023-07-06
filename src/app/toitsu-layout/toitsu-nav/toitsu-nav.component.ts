import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {ToitsuNavService} from './toitsu-nav.service';

@Component({
  selector: 'app-toitsu-nav',
  template: `
    <ul class="layout-menu">
      <li app-toitsu-navitem *ngFor="let item of toitsuNavService.model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
    </ul>
  `
})
export class ToitsuNavComponent implements OnInit {
  
  constructor(
    public app: AppComponent,
    public toitsuNavService: ToitsuNavService
  ) {}
  
  ngOnInit() {
    this.toitsuNavService.initializeLayoutModel(this.app);
    this.toitsuNavService.initializeModel();
  }
}
