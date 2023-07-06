import {Component} from '@angular/core';
import {appConsts} from '../../../app-consts';

@Component({
  selector: 'app-toitsu-footer',
  templateUrl: './toitsu-footer.component.html',
  styleUrls: ['./toitsu-footer.component.css'],
})
export class ToitsuFooterComponent {
  version = appConsts.version;
}
