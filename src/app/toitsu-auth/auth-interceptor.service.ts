import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {catchError} from 'rxjs';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  
  constructor(public translate: TranslateService, private authService: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.startsWith(environment.apiBaseUrl)) {
      
      let headers = req.headers;
      
      if (this.authService.isLoggedIn()) {
        headers = headers.append('Authorization', 'Bearer ' + this.authService.getToken());
      }
      
      headers = headers.append('Accept-Language', 'el');
      
      const modifiedReq = req.clone({
        headers: headers
      });
      
      return next.handle(modifiedReq).pipe(
        // Globally catch api errors
        catchError((responseError) => {
          // Αν μια κλήση στο api επιστρέψει 401, σημαίνει πως το token είναι άκυρο, λογικά λόγω logout από άλλη εφαρμογή
          // Πραγματοποίηση logout
          if (responseError.status === 401) {
            this.authService.logout();
          }
          throw responseError;
        })
      );
    }
    return next.handle(req);
  }
}
