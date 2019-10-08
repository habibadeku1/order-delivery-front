/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralDialogComponent } from './main-pages/general-dialog/general-dialog.component';
import { GeneralModalComponent } from './main-pages/general-modal/general-modal.component';
import { ProductModalComponent } from './main-pages/general-modal/product-modal/product-modal.component'
import { CustomerModalComponent } from './main-pages/general-modal/customer-modal/customer-modal.component'
import { NbDialogModule, NbWindowModule } from '@nebular/theme';
import { NbPasswordAuthStrategy, NbAuthModule, NbAuthJWTToken } from '@nebular/auth';
import { AppSettings } from './AppConstants';
import { AuthGuard } from './auth-guard.service';
import { MyHttpInterceptor } from './interceptors/myhttp.interceptor';
import { AuthService } from './auth.service';


const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

@NgModule({
  declarations: [AppComponent, GeneralDialogComponent, GeneralModalComponent, ProductModalComponent, CustomerModalComponent],
  entryComponents: [GeneralDialogComponent, GeneralModalComponent, ProductModalComponent, CustomerModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          token: {
            class: NbAuthJWTToken,
            key: 'jwt', // this parameter tells where to look for the token

          },

          baseEndpoint: AppSettings.baseApIURL,
          login: {
            endpoint: 'auth/local',
            method: 'post',
          },
          register: {
            endpoint: 'auth/local/register',
            method: 'post',
          },
          logout: {
            endpoint: 'auth/sign-out',
            method: 'post',
          },
          requestPass: {
            endpoint: 'auth/request-pass',
            method: 'post',
          },
          resetPass: {
            endpoint: 'auth/reset-pass',
            method: 'post',
          },

        }),
      ],
      forms: {
        login: formSetting,
        register: formSetting,
        requestPassword: formSetting,
        resetPassword: formSetting,
        logout: {
          redirectDelay: 0,
        },
      },
    }), 

  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    // { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    AuthGuard,
    AuthService
  ],
})
export class AppModule {
}
