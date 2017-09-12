import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Variables} from "../../app/variables";
import {TranslateService} from "@ngx-translate/core";
import * as Moment from "moment";
import {NgForm} from "@angular/forms";
import {ModalProvider} from "../../components/modal-component/modal-provider";
import {LoaderProvider} from "../../components/loader-component/loader-provider";
import {
  PracticeProvider, RegisterDataInterface, ConnectDataInterface,
  ConnectResponseInterface
} from "../../providers/practice-provider";
import {Router} from "@angular/router";
import {FlashProvider} from "../../components/flash-component/flash-provider";

export interface RegisterFormDataInterface extends RegisterDataInterface {
  password_repeat: string
}

export interface PositionListInterface {
  id: number,
  name: string,
  languages: string[]
}

export interface LanguageListInterface {
  id: number,
  code: string,
  name: string
}

@Component({
  selector: 'register-page',
  templateUrl: 'register-page.html',
  styleUrls: [
    'register-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPage implements OnInit {
  public formData: RegisterFormDataInterface = {
    company: "",
    address: "",
    phone: "",
    contact_email: "",
    webpages: "",
    language_id: null,
    password: "",
    password_repeat: "",
    title: "",
    name: "",
    surname: "",
    position_id: null,
    gender: null
  };

  public soloMedData: ConnectDataInterface = {
    username: "",
    password: ""
  };

  public passwordRegExp: string = Variables.passwordRegex;

  public soloMedConnected: boolean = false;

  public languageList: LanguageListInterface[] = Variables.translator.languageList;

  public genderList: {id: number, name: string}[] = Variables.genderList;

  public positionList: PositionListInterface[] = [];

  public soloMed: boolean = false;

  constructor(private translate: TranslateService,
              private modal: ModalProvider,
              private loader: LoaderProvider,
              private practice: PracticeProvider,
              private router: Router,
              private flash: FlashProvider) {

  }

  ngOnInit() {
    this.positionList = this.loadPositions(this.translate.currentLang);

    this.translate.onLangChange.subscribe(() => {
      this.positionList = this.loadPositions(this.translate.currentLang);
    });

    this.formData.language_id = this.getLanguageId();

    this.soloMedConnected = false;
  }

  private getLanguageId(code: string = this.translate.currentLang): number {
    let langId: number = null;

    this.languageList.forEach((lan: LanguageListInterface) => {
      if (lan.code === code) {
        langId = lan.id;
      }
    });

    return langId;
  }

  private loadPositions(lang: string = Variables.translator.languageDefault): PositionListInterface[] {
    let arr: PositionListInterface[] = [];

    Variables.positionList.forEach((position: PositionListInterface) => {
      if (position.languages.indexOf(lang) >= 0) {
        arr.push(position);
      }
    });

    return arr;
  }

  public passwordValid(password: string): boolean {
    return new RegExp(Variables.passwordRegex).test(password);
  }

  public selectLanguage(language: number): void {
    if (this.formData.language_id !== language) {
      return;
    }

    this.languageList.forEach((lang: LanguageListInterface) => {
      if (lang.id === language) {
        this.formData.language_id = language;

        this.translate.use(lang.code);

        Moment.locale(lang.code);
      }
    });
  }

  public createUser(form: NgForm): void {
    if (!form.valid || this.formData.password !== this.formData.password_repeat || this.formData.position_id === null || this.formData.language_id === null) {
      return;
    }

    this.loader.show();

    this.practice.register({
      company: this.formData.company,
      address: this.formData.address,
      phone: this.formData.phone,
      contact_email: this.formData.contact_email,
      webpages: this.formData.webpages,
      language_id: Number(this.formData.language_id),
      password: this.formData.password,
      title: this.formData.title,
      name: this.formData.name,
      surname: this.formData.surname,
      position_id: Number(this.formData.position_id),
      gender: this.formData.gender
    }).then(() => {
      this.formData = {
        company: "",
        address: "",
        phone: "",
        contact_email: "",
        webpages: "",
        language_id: this.getLanguageId(),
        password: "",
        password_repeat: "",
        title: "",
        name: "",
        surname: "",
        position_id: null,
        gender: null
      };

      this.loader.hide();

      this.router.navigate([
        "/login"
      ]);
    }, (error: string) => {
      this.loader.hide();

      this.formData.password = "";

      this.formData.password_repeat = "";

      this.modal.show({
        title: "login.LOGIN_FAILED",
        content: "error." + (error || "SERVICE_FAILURE"),
        translate: true,
        buttons: [
          {
            text: "general.CLOSE"
          }
        ]
      });
    });
  }

  public connectSoloMed(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.loader.show();

    this.practice.connect({
      username: this.soloMedData.username,
      password: this.soloMedData.password
    }).then((data: ConnectResponseInterface) => {
      this.formData = {
        company: data.amcompany1,
        address: [data.amstreet1, data.amstreet2, data.amzip, data.amcity].join(", "),
        phone: data.ammobile,
        contact_email: data.amemail,
        webpages: "",
        language_id: this.getLanguageId(),
        password: this.soloMedData.password,
        password_repeat: this.soloMedData.password,
        title: "",
        name: data.amfirstname,
        surname: data.amlastname,
        position_id: null,
        gender: ((data.amgender.toLowerCase() === "m") ? "male" : "female")
      };

      this.soloMedData = {
        username: "",
        password: ""
      };

      this.soloMed = false;

      this.soloMedConnected = true;

      this.loader.hide();
    }, (error: string) => {
      this.loader.hide();

      this.soloMedData.password = "";

      this.modal.show({
        title: "login.CONNECT_FAILED",
        content: "error." + (error || "SERVICE_FAILURE"),
        translate: true,
        buttons: [
          {
            text: "general.CLOSE"
          }
        ]
      });
    });
  }
}
