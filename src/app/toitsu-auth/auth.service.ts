import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {KeycloakEventType, KeycloakService} from 'keycloak-angular';
import {DateService} from '../toitsu-shared/date.service';
import {ToitsuTableService} from '../toitsu-shared/toitsu-table/toitsu-table.service';
import {environment} from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  
  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    private dateService: DateService,
    private toitsuTableService: ToitsuTableService
  ) {
    // Subject for refresh token
    keycloakService.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type === KeycloakEventType.OnTokenExpired) {
          // Token has expired
          
          // Check if auth data exists in the local storage
          let userAuth = JSON.parse(localStorage.getItem('userAuth'));
          if (userAuth && userAuth.exp) {
            
            if (userAuth.token === keycloakService.getKeycloakInstance().token) {
              // The token has not yet been refreshed
              
              // Update the access token
              keycloakService.updateToken().then(response => {
                if (response) {
                  // Also update the local storage auth data
                  this.setAuthToLocalStorage(keycloakService.getKeycloakInstance());
                }
              });
            }
            else {
              // The token has already been refreshed by another browser tab.
              // Due to the revoke refresh token setting, if we try to refresh it again, it will fail and invalidate the tokens of the whole session.
              
              // The above subject will stop firing after this, so there is no way to keep refreshing the token without reloading the tab.
              
              // As long as the 'main' tab is open, the token will continue to be refreshed
              // and set to the local storage to be used by the other tabs.
              
              // If the 'main' tab is closed, the refreshing will stop.
              // This means that the token will in time become invalid.
              // There is apparently no way to avoid this.
            }
            
          }
          else {
            // No auth data exists in the local storage (normally cannot occur) -> call login to reload
            this.login();
          }
        }
      }
    });
  }
  
  login() {
    this.keycloakService.login();
  }
  
  logout() {
    this.keycloakService.logout(location.origin);
    this.removeAuthFromLocalStorage();
  }
  
  setAuthToLocalStorage(keycloakInstance) {
    
    let auth = {
      token: keycloakInstance.token,
      refreshToken: keycloakInstance.refreshToken,
      idToken: keycloakInstance.idToken,
      exp: keycloakInstance.tokenParsed ? keycloakInstance.tokenParsed.exp : null
    };
    
    let userInfo = {
      username: keycloakInstance.profile.username,
      lastName: keycloakInstance.profile.lastName,
      firstName: keycloakInstance.profile.firstName,
      email: keycloakInstance.profile.email,
      dcId: null,
      dcName: null,
      isMinistry: null
    };
    
    // Custom user attributes
    if (keycloakInstance.profile.attributes) {
      let attributes = keycloakInstance.profile.attributes;
      
      // Id οργανωτικής μονάδας -> Id καταστήματος κράτησης (Μετατρέπεται σε αριθμό)
      if (attributes.orgUnitId && attributes.orgUnitId.length > 0) {
        userInfo.dcId = (attributes.orgUnitId[0]) ? Number(attributes.orgUnitId[0]) : null;
      }
      
      // Ονομασία οργανωτικής μονάδας -> Ονομασία καταστήματος κράτησης
      if (attributes.orgUnitName && attributes.orgUnitName.length > 0) {
        userInfo.dcName = attributes.orgUnitName[0];
      }
      
      // Επιβλέπουσα οργανωτική μονάδα -> Υπουργείο
      if (attributes.orgUnitSupervising && attributes.orgUnitSupervising.length > 0) {
        userInfo.isMinistry = (attributes.orgUnitSupervising[0] === 'true');
      }
    }
    
    // Roles
    let clientResourceAccess = keycloakInstance.tokenParsed ? keycloakInstance.tokenParsed.resource_access[environment.keycloak.roleClientId] : null;
    let roles = clientResourceAccess ? clientResourceAccess.roles : [];
    
    localStorage.setItem('userAuth', JSON.stringify(auth));
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('userPermissions', JSON.stringify(roles));
    
    // Τελευταίο κατάστημα κράτησης
    // Το αποθηκεύουμε ξεχωριστά στο localStorage και παραμένει και μετά το logout.
    // Χρησιμοποιείται ώστε να καθαρίσουμε τα αποθηκευμένα κριτήρια αναζήτησης και στοιχεία paging αν γίνει login με χρήστη άλλου καταστήματος.
    let lastSavedDcId = localStorage.getItem('lastDcId');
    if (lastSavedDcId && Number(lastSavedDcId) !== userInfo.dcId) {
      this.toitsuTableService.removeAllArgsAndPagingFromLocalStorage();
    }
    localStorage.setItem('lastDcId', userInfo.dcId);
  }
  
  removeAuthFromLocalStorage() {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userPermissions');
  }
  
  isLoggedIn() {
    // Check if auth data exists in the local storage
    let userAuth = JSON.parse(localStorage.getItem('userAuth'));
    
    if (!userAuth || !userAuth.exp) {
      return false; 
    }
    
    // Check if the token has expired
    let expirationDate = this.dateService.unixSecondsToDate(userAuth.exp);
    return this.dateService.dateInFuture(expirationDate);
  }
  
  getUserDisplayName() {
    let displayName = '';
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      if (userInfo['lastName'] || userInfo['firstName']) {
        if (userInfo['lastName']) {
          displayName += userInfo['lastName'];
        }
        if (userInfo['firstName']) {
          displayName += ' ' + userInfo['firstName'];
        }
      }
      else if (userInfo['username']) {
        displayName = userInfo['username'];
      }
      else if (userInfo['email']) {
        displayName = userInfo['email'];
      }
    }
    return displayName;
  }
  
  getUserDcId() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      return userInfo['dcId'];
    }
    
    return null;
  }
  
  getUserDcName() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      return userInfo['dcName'];
    }
    
    return null;
  }
  
  isMinistry() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      return userInfo['isMinistry'];
    }
    
    return false;
  }
  
  hasPermission(permission: string) {
    
    if (!this.isLoggedIn()) {
      return false;
    }
    
    if (!permission) {
      return true;
    }
    
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions'));
    
    if (userPermissions) {
      if (userPermissions.indexOf(permission) >= 0) {
        return true;
      }
    }
    
    return false;
  }
  
  hasAnyPermission(permissions: string[]) {
    
    if (!this.isLoggedIn()) {
      return false;
    }
    
    if (!permissions || !permissions.length) {
      return true;
    }
    
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions'));
    
    if (userPermissions) {
      for (let permission of permissions) {
        if (userPermissions.indexOf(permission) >= 0) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  hasAllPermissions(permissions: string[]) {
    
    if (!this.isLoggedIn()) {
      return false;
    }
    
    if (!permissions || !permissions.length) {
      return true;
    }
    
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions'));
    
    if (userPermissions) {
      for (let permission of permissions) {
        if (userPermissions.indexOf(permission) === -1) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  getToken() {
    let userAuth = JSON.parse(localStorage.getItem('userAuth'));
    if (userAuth) {
     return userAuth['token'];
    }
    
    return null;
  }
}
