import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TranslateModule, TranslateLoader, MissingTranslationHandler} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from '@angular/router';
import {HttpLoaderFactory, CustomMissingTranslationHandler} from "./translator";
import {AppComponent} from './app-component';
import {Router} from "./router";
import {environment} from "../environments/environment";
import {ReplaceValuePipe, ConvertNumberPipe} from "../pipes";
import {LoggerProvider} from "../providers";
import {FlashComponent, FlashProvider, LoaderComponent, LoaderProvider, SlideToggleComponent} from "../components";
import {HomePage, NotFoundPage} from "../pages";
import {Variables} from "./variables";
import {MenuComponent} from "../components/menu-component/menu-component";

@NgModule({
  declarations: [
    AppComponent,
    ConvertNumberPipe,
    ReplaceValuePipe,
    FlashComponent,
    LoaderComponent,
    SlideToggleComponent,
    HomePage,
    NotFoundPage,
    MenuComponent
  ],
  imports: [
    BrowserModule,
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
    LoggerProvider,
    ConvertNumberPipe,
    ReplaceValuePipe,
    FlashProvider,
    LoaderProvider
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
