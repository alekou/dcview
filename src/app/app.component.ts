import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter, map, mergeMap} from 'rxjs/operators';
import {PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuNavService} from './toitsu-layout/toitsu-nav/toitsu-nav.service';
import {ToitsuBreadcrumbService} from './toitsu-layout/toitsu-breadcrumb/toitsu-breadcrumb.service';
import {ToitsuBlockUiService} from './toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuToasterService} from './toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {AuthService} from './toitsu-auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  layoutMode = 'static';
  menuTheme = 'noir';
  menuScheme = 'light';
  
  profileMode = 'top';
  ripple = true;
  topbarMenuActive: boolean;
  overlayMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuClick: boolean;
  topbarItemClick: boolean;
  activeTopbarItem: any;
  menuHoverActive: boolean;
  rightPanelActive: boolean;
  rightPanelClick: boolean;
  megaMenuActive: boolean;
  megaMenuClick: boolean;
  usermenuActive: boolean;
  usermenuClick: boolean;
  activeProfileItem: any;
  
  routeLoading = false;
  
  constructor(public renderer: Renderer2,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private primengConfig: PrimeNGConfig,
              private toitsuNavService: ToitsuNavService,
              public translate: TranslateService,
              private toitsuBreadcrumbService: ToitsuBreadcrumbService,
              private titleService: Title,
              public toitsuBlockUiService: ToitsuBlockUiService,
              private toitsuToasterService: ToitsuToasterService,
              public authService: AuthService) {
    
    this.titleService.setTitle(this.translate.instant('global.appTitle'));

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter(route => route.outlet === 'primary'))
      .pipe(mergeMap(route => route.data))
      .subscribe(event => {
        if (event.title) {
          this.titleService.setTitle(this.translate.instant(event.title));
        } else {
          this.titleService.setTitle(this.translate.instant('global.appTitle'));
        }

        this.toitsuBreadcrumbService.setItems(event.breadcrumbs);
      });
    
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.routeLoading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          if (event['error']) {
            this.toitsuToasterService.apiValidationErrors(event['error']);
          }
          this.routeLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
    
    const toitsuConfig = JSON.parse(localStorage.getItem('toitsuConfig'));
    if (toitsuConfig) {
      if (toitsuConfig['layoutMode']) {
        this.layoutMode = toitsuConfig['layoutMode'];
      }
      if (toitsuConfig['menuTheme'] && toitsuConfig['menuScheme']) {
        this.menuTheme = toitsuConfig['menuTheme'];
        this.menuScheme = toitsuConfig['menuScheme'];
        
        this.changeStyleSheetsColor('theme-css', 'theme-' + this.menuTheme + '.css');
        this.changeStyleSheetsColor('layout-css', 'layout-' + this.menuTheme + '.css');
      }
    }
  }
  
  ngOnInit() {
    this.translate.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
    
    if (this.ripple) {
      this.primengConfig.ripple = true;
    }
  }
  
  onLayoutClick() {
    if (!this.topbarItemClick) {
      this.activeTopbarItem = null;
      this.topbarMenuActive = false;
    }

    if (!this.rightPanelClick) {
      this.rightPanelActive = false;
    }

    if (!this.megaMenuClick) {
      this.megaMenuActive = false;
    }

    if (!this.usermenuClick && this.isSlim()) {
      this.usermenuActive = false;
      this.activeProfileItem = null;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.toitsuNavService.reset();
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
    }

    this.topbarItemClick = false;
    this.menuClick = false;
    this.rightPanelClick = false;
    this.megaMenuClick = false;
    this.usermenuClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.layoutMode === 'overlay') {
      this.overlayMenuActive = !this.overlayMenuActive;
    } else {
      if (this.isDesktop()) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      } else {
        this.staticMenuMobileActive = !this.staticMenuMobileActive;
      }
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  onTopbarSubItemClick(event) {
    event.preventDefault();
  }

  onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
  }

  onRightPanelClick() {
    this.rightPanelClick = true;
  }

  onMegaMenuButtonClick(event) {
    this.megaMenuClick = true;
    this.megaMenuActive = !this.megaMenuActive;
    event.preventDefault();
  }

  onMegaMenuClick() {
    this.megaMenuClick = true;
  }

  hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isHorizontal() {
    return this.layoutMode === 'horizontal';
  }

  isSlim() {
    return this.layoutMode === 'slim';
  }

  isOverlay() {
    return this.layoutMode === 'overlay';
  }
  
  changeLayoutMode(layoutMode: string) {
    this.layoutMode = layoutMode;
    
    this.setToitsuConfig();
  }
  
  changeTheme(theme: string, scheme: string) {
    this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '.css');
    this.changeStyleSheetsColor('layout-css', 'layout-' + theme + '.css');
    
    this.menuTheme = theme;
    this.menuScheme = scheme;
    
    this.setToitsuConfig();
  }
  
  changeStyleSheetsColor(id, value) {
    const element = document.getElementById(id);
    const urlTokens = element.getAttribute('href').split('/');
    urlTokens[urlTokens.length - 1] = value;
    
    const newURL = urlTokens.join('/');
    
    this.replaceLink(element, newURL);
  }
  
  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }
  
  replaceLink(linkElement, href) {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);
      
      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');
      
      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
      
      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }
  
  setToitsuConfig() {
    localStorage.setItem('toitsuConfig', JSON.stringify({
      layoutMode: this.layoutMode,
      menuTheme: this.menuTheme,
      menuScheme: this.menuScheme
    }));
  }
}
