import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateLoader, MissingTranslationHandler} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpLoaderFactory, CustomMissingTranslationHandler} from "./translator";
import {AppComponent} from './app-component';
import {Router} from "./router";
import {environment} from "../environments/environment";
import {ReplaceValuePipe, ConvertNumberPipe} from "../pipes";
import {LoggerProvider, AuthProvider, PracticeProvider, ClientProvider} from "../providers";
import {
  FlashComponent,
  FlashProvider,
  LoaderComponent,
  LoaderProvider,
  SlideToggleComponent,
  MenuComponent,
  ModalComponent,
  ModalProvider
} from "../components";
import {HomePage, NotFoundPage, LoginPage, RegisterPage, ForgotPage} from "../pages";
import {Variables} from "./variables";
import {AuthGuard} from "../guards";

@NgModule({
  declarations: [
    AppComponent,
    ConvertNumberPipe,
    ReplaceValuePipe,
    FlashComponent,
    LoaderComponent,
    SlideToggleComponent,
    HomePage,
    LoginPage,
    NotFoundPage,
    MenuComponent,
    ModalComponent,
    RegisterPage,
    ForgotPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [
          HttpClient
        ]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler
      },
    }),
    NgbModule.forRoot(),
    RouterModule.forRoot(Router, {
      enableTracing: !environment.production && Variables.routerDebug
    })
  ],
  providers: [
    CookieService,
    LoggerProvider,
    ConvertNumberPipe,
    ReplaceValuePipe,
    FlashProvider,
    LoaderProvider,
    AuthProvider,
    AuthGuard,
    ModalProvider,
    PracticeProvider,
    ClientProvider
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
