import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule, JsonPipe} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {BlockUIModule} from 'primeng/blockui';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {DividerModule} from 'primeng/divider';
import {OrderListModule} from 'primeng/orderlist';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {TooltipModule} from 'primeng/tooltip';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {appRoutes} from './app-routing.module';
import {toitsuTranslateLoader} from './toitsu-shared/toitsu-translate/toitsu-translate-loader';
import {toitsuTranslateInitializer} from './toitsu-shared/toitsu-translate/toitsu-translate-initializer';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {AppComponent} from './app.component';
import {ToitsuNavSubsystemComponent} from './toitsu-layout/toitsu-nav/toitsu-nav-subsystem.component';
import {ToitsuNavComponent} from './toitsu-layout/toitsu-nav/toitsu-nav.component';
import {ToitsuNavitemComponent} from './toitsu-layout/toitsu-nav/toitsu-navitem.component';
import {ToitsuHeaderComponent} from './toitsu-layout/toitsu-header/toitsu-header.component';
import {ToitsuFooterComponent} from './toitsu-layout/toitsu-footer/toitsu-footer.component';
import {ToitsuBreadcrumbComponent} from './toitsu-layout/toitsu-breadcrumb/toitsu-breadcrumb.component';
import {NotificationsComponent} from './sa/notification/notifications/notifications.component';
import {NotificationAlertDialogComponent} from './sa/notification/notification-alert-dialog/notification-alert-dialog.component';
import {IndexComponent} from './toitsu-layout/index/index.component';
import {initializeKeycloak} from './toitsu-auth/keycloak.init';
import {AuthService} from './toitsu-auth/auth.service';
import {AuthInterceptorService} from './toitsu-auth/auth-interceptor.service';


@NgModule({
    declarations: [
        AppComponent,
        ToitsuNavSubsystemComponent,
        ToitsuNavComponent,
        ToitsuNavitemComponent,
        ToitsuHeaderComponent,
        ToitsuFooterComponent,
        ToitsuBreadcrumbComponent,
        NotificationsComponent,
        NotificationAlertDialogComponent,
        IndexComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (toitsuTranslateLoader),
                deps: [HttpClient]
            }
        }),
        KeycloakAngularModule,

        CommonModule,
        BlockUIModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        ToastModule,
        DividerModule,
        OrderListModule,
        OverlayPanelModule,
        TooltipModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: toitsuTranslateInitializer,
            deps: [TranslateService, Injector],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService, AuthService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        },
        MessageService,
        ConfirmationService,
        DialogService,
        JsonPipe
    ],
    exports: [
        ToitsuNavitemComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
