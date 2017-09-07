import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {Variables} from "./variables";
import * as Moment from "moment";
import {LoggerProvider} from "../providers/logger-provider";
import {AuthProvider} from "../providers/auth-provider";

declare const navigator: Navigator;

export interface LangListItem {
  name: string,
  code: string
}

@Component({
  selector: 'app-root',
  templateUrl: 'app-component.html',
  styleUrls: [
    'app-component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public static ShowMenu: boolean = false;

  private language: string;

  public isMenu: boolean;

  public backgroundImageUrl: string = Variables.images.backgroundUrl;

  public iconImageUrl: string = Variables.images.logoUrl;

  public languageList: LangListItem[] = Variables.translator.languageList;

  constructor(private translate: TranslateService,
              private title: Title,
              private auth: AuthProvider) {
    this.initTitle();

    this.switchLanguage(this.checkLocale());

    this.auth.$onLogin.subscribe(() => {
      this.isMenu = true;
    });

    this.auth.$onLogout.subscribe(() => {
      this.isMenu = false;
    });
  }

  private checkLocale(code: string = Variables.translator.languageDefault): string {
    let userLang: string = navigator.language || null,
      found: boolean = false;

    if (typeof userLang === 'string' && userLang.length >= 2) {
      this.languageList.forEach((lang: LangListItem) => {
        if (!found && userLang[0] + userLang[1] === lang.code) {
          LoggerProvider.Log("[TRANSLATOR]: Found supported user language '" + lang.name + "' for '" + userLang + "'.");

          code = lang.code;

          found = true;
        }
      });
    }

    if (!found) {
      LoggerProvider.Warning("[TRANSLATOR]: Could not find supported user language for '" + userLang + "'.");
    }

    return code;
  }

  private switchLanguage(code: string) {
    this.language = code;

    this.translate.setDefaultLang(code);

    this.translate.use(code);

    Moment.locale(code);
  }

  private initTitle() {
    this.translate.onLangChange.subscribe(() => {
      this.title.setTitle(this.translate.instant("general.TITLE"));
    });
  }
}
