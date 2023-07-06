import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {ToitsuNavService} from '../toitsu-layout/toitsu-nav/toitsu-nav.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService, private toitsuNavService: ToitsuNavService) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    
    if (!this.authService.isLoggedIn()) {
      this.toitsuNavService.initializeSubsystemModel();
      this.toitsuNavService.initializeModel();
      this.authService.login();
      return false;
    }
    
    const routePermissions = route.data['permissions'];
    if (!routePermissions || routePermissions.length === 0) {
      return true;
    }
    
    const anyPermission = !!route.data['anyPermission'];
    let canNavigate = true;
    
    if (anyPermission) {
      canNavigate = this.authService.hasAnyPermission(routePermissions);
    }
    else {
      canNavigate = this.authService.hasAllPermissions(routePermissions);
    }
    
    if (canNavigate) {
      return true;
    }
    else {
      this.toitsuNavService.initializeSubsystemModel();
      this.toitsuNavService.initializeModel();
      return this.router.createUrlTree(['/403']);
    }
  }
}
