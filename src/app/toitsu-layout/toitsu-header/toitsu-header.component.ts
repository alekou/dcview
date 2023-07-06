import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppComponent} from '../../app.component';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-toitsu-header',
  templateUrl: './toitsu-header.component.html',
  styleUrls: ['./toitsu-header.component.css'],
})
export class ToitsuHeaderComponent {
  
  currentLanguage = this.translate.currentLang;
  
  constructor(
    public translate: TranslateService,
    public app: AppComponent,
    public authService: AuthService
  ) {}
  
  login(event) {
    event.preventDefault();
    this.authService.login();
  }
  
  logout(event) {
    event.preventDefault();
    this.app.topbarItemClick = true;
    this.app.topbarMenuActive = !this.app.topbarMenuActive;
    this.app.hideOverlayMenu();
    
    this.authService.logout();
  }
  
  changeLanguage(newLanguage) {
    if (newLanguage !== this.currentLanguage) {
      this.translate.use(newLanguage).subscribe(() => {
        localStorage.setItem('toitsuLanguage', newLanguage);
        window.location.reload();
      });
    }
  }
}
