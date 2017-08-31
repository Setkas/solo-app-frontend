import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {Variables} from "./variables";

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

  private backgroundImageUrl: string = Variables.images.backgroundUrl;

  private iconImageUrl: string = Variables.images.logoUrl;

  constructor(private translate: TranslateService,
              private title: Title) {
    this.isMenu = AppComponent.ShowMenu;

    this.initTitle();

    this.initTranslator();
  }

  private initTranslator() {
    this.language = Variables.translator.languageDefault;

    this.translate.setDefaultLang(Variables.translator.languageDefault);

    this.translate.use(Variables.translator.languageDefault);
  }

  private initTitle() {
    this.translate.onLangChange.subscribe(() => {
      this.title.setTitle(this.translate.instant("general.TITLE"));
    });
  }
}
