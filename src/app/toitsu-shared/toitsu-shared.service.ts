import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {FormArray, FormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ToitsuSharedService {
  
  private previousUrl: string;
  private currentUrl: string;
  
  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }
  
  initHttpParams(paramsObject) {
    let httpParams = new HttpParams();
    for (let key of Object.keys(paramsObject)) {
      if (paramsObject[key]) {
        httpParams = httpParams.append(key, paramsObject[key]);
      }
    }
    return httpParams;
  }
  
  getPreviousUrl() {
    return this.previousUrl;
  }
  
  updateTreeValidity(group): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.updateTreeValidity(abstractControl);
      } else {
        abstractControl.updateValueAndValidity();
      }
    });
  }
}
