import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToitsuBlockUiService {
  
  private uiBlocked = false;
  
  getUiBlocked() {
    return this.uiBlocked;
  }
  
  blockUi() {
    this.uiBlocked = true;
  }
  
  unblockUi() {
    this.uiBlocked = false;
  }
}
