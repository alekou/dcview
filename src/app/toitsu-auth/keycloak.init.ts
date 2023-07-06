import {HttpRequest} from '@angular/common/http';
import {KeycloakService} from 'keycloak-angular';
import {AuthService} from './auth.service';
import {environment} from 'src/environments/environment';

export function initializeKeycloak(keycloak: KeycloakService, authService: AuthService): () => Promise<any> {
  
  return () =>
    
    keycloak.init({
      config: {
        url: environment.keycloak.issuer,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        flow: 'standard',
        pkceMethod: 'S256',
        onLoad: 'check-sso',
        checkLoginIframe: false
      },
      shouldAddToken(req: HttpRequest<unknown>) {
        return false;
      },
      bearerExcludedUrls: [],
      loadUserProfileAtStartUp: true
    }).then((auth) => {
      if (auth) {
        // Ορισμός των στοιχείων στο local storage
        keycloak.isLoggedIn().then((isLoggedIn) => {
          authService.setAuthToLocalStorage(keycloak.getKeycloakInstance());
        });
      }
      else {
        localStorage.removeItem('notificationAlertsDismissed');
        
        if (authService.getToken()) {
          // Αν το keycloak δείχνει ότι δεν είμαστε logged in αλλά υπάρχει token στο local storage, σημαίνει πως έγινε logout από άλλη εφαρμογή
          // Πραγματοποίηση logout
          authService.logout();
        }
      }
    });
}
