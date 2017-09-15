import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Variables} from "../../app/variables";
import {UserProvider} from "../../providers";
import {AuthProvider} from "../../providers/auth-provider";
import {SetupDataInterface, SetupProvider} from "../../providers/setup-provider";
import {TranslateService} from "@ngx-translate/core";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {LanguageListInterface, PositionListInterface} from "../register-page/register-page";
import {CreateUserDataInterface, UserDetailsInterface} from "../../providers/user-provider";
import {ModalProvider} from "../../components/modal-component/modal-provider";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {LoaderProvider} from "../../components/loader-component/loader-provider";
import {PracticeDetailsInterface, PracticeProvider} from "../../providers/practice-provider";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'settings-page',
  templateUrl: 'settings-page.html',
  styleUrls: [
    'settings-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class SettingsPage implements OnInit, OnDestroy {
  public activeTab: string = "client";

  public formData: SetupDataInterface = {
    client_history: null,
    client_reminder: null,
    notes_history: null,
    therapy_color: null
  };

  public userFormData: CreateUserDataInterface = {
    gender: null,
    title: "",
    name: "",
    surname: "",
    position_id: null
  };

  public userEditFormData: {title: string, name: string, surname: string, position_id: number} = {
    title: "",
    name: "",
    surname: "",
    position_id: null
  };

  public practiceEditFormData: {company: string, address: string, phone: string, contact_email: string, webpages: string, language_id: number, system_email: string} = {
    company: "",
    address: "",
    phone: "",
    contact_email: "",
    webpages: "",
    language_id: null,
    system_email: ""
  };

  private inputData: SetupDataInterface = null;

  public clientHistoryNumeral: number[] = [
    1,
    2,
    3,
    4,
    5
  ];

  public notesHistoryNumeral: number[] = [
    0,
    1,
    2,
    3,
    4,
    5
  ];

  public therapyColorNumeral: {value: number, preview: string, image: string}[] = Variables.stixList;

  public clientReminderNumeral: {value: number, name: string}[] = Variables.clientReminders;

  public createUserOpen: boolean = false;

  public genderList: {id: number, name: string}[] = Variables.genderList;

  public positionList: PositionListInterface[] = [];

  public userList: UserDetailsInterface[] = [];

  public languageList: LanguageListInterface[] = Variables.translator.languageList;

  private subs: Subscription[] = [];

  constructor(private translate: TranslateService,
              private flash: FlashProvider,
              public auth: AuthProvider,
              private setup: SetupProvider,
              public user: UserProvider,
              private modal: ModalProvider,
              private loader: LoaderProvider,
              public practice: PracticeProvider) {
    this.subs.push(setup.$onLoad.subscribe(() => {
      this.dataLoad();
    }));

    this.positionList = this.loadPositions(this.translate.currentLang);

    this.subs.push(this.translate.onLangChange.subscribe(() => {
      this.positionList = this.loadPositions(this.translate.currentLang);
    }));

    this.subs.push(this.user.$onLoad.subscribe(() => {
      this.setUserEditData();
    }));

    this.subs.push(this.practice.$onLoad.subscribe(() => {
      this.setPracticeEditData();
    }));
  }

  ngOnInit() {
    this.dataLoad();

    if (this.user.details !== null) {
      this.setUserEditData();
    }

    if (this.practice.details !== null) {
      this.setPracticeEditData();
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  private setPracticeEditData(): void {
    let source: PracticeDetailsInterface = JSON.parse(JSON.stringify(this.practice.details));

    this.practiceEditFormData = {
      company: source.company,
      address: source.address,
      phone: source.phone,
      contact_email: source.contact_email,
      webpages: source.webpages,
      language_id: source.language_id,
      system_email: source.system_email
    };
  }

  private setUserEditData(): void {
    let source: UserDetailsInterface = JSON.parse(JSON.stringify(this.user.details));

    this.userEditFormData = {
      title: source.title,
      name: source.name,
      surname: source.surname,
      position_id: source.position_id
    };
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

  private dataLoad() {
    this.formData = {
      client_history: ((this.setup.current && this.setup.current.client_history) ? this.setup.current.client_history : Variables.setupDefaults.client_history),
      client_reminder: ((this.setup.current && this.setup.current.client_reminder) ? this.setup.current.client_reminder : Variables.setupDefaults.client_reminder),
      notes_history: ((this.setup.current && this.setup.current.notes_history) ? this.setup.current.notes_history : Variables.setupDefaults.notes_history),
      therapy_color: ((this.setup.current && this.setup.current.therapy_color) ? this.setup.current.therapy_color : Variables.setupDefaults.therapy_color)
    };

    this.inputData = JSON.parse(JSON.stringify(this.formData));
  }

  public selectTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'user' && this.userList.length === 0) {
      this.user.list().then((data: UserDetailsInterface[]) => {
        this.userList = data;
      }, () => {

      });
    }
  }

  public areChanges(): boolean {
    let changed: boolean = false;

    for (let key in this.formData) {
      if (this.inputData === null || this.formData[key] !== this.inputData[key]) {
        changed = true;
      }
    }

    return changed;
  }

  public saveSetup(): void {
    this.loader.show();

    let updates: SetupDataInterface = {};

    for (let key in this.formData) {
      if (this.inputData === null || this.formData[key] !== this.inputData[key]) {
        updates[key] = this.formData[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      this.setup.patch(updates).then(() => {
        this.setup.current = JSON.parse(JSON.stringify(this.formData));

        this.dataLoad();

        this.loader.hide();

        this.flash.show({
          content: this.translate.instant("settings.SETUP_SAVED"),
          type: "success"
        });
      }, (err: string) => {
        this.loader.hide();

        this.flash.show({
          content: this.translate.instant("error." + err),
          type: "danger"
        });
      });
    } else {
      this.loader.hide();
    }
  }

  public getPositionName(positionId: number): string {
    let position: string = "UNKNOWN";

    this.positionList.forEach((pos: PositionListInterface) => {
      if (positionId === pos.id) {
        position = pos.name;
      }
    });

    return position;
  }

  public createUser(): void {
    this.loader.show();

    this.user.create(JSON.parse(JSON.stringify(this.userFormData))).then(() => {
      this.flash.show({
        content: this.translate.instant("settings.NEW_USER_CREATED"),
        type: "success"
      });

      this.user.list().then((data: UserDetailsInterface[]) => {
        this.loader.hide();

        this.userList = data;
      }, () => {
        this.loader.hide();
      });
    }, (err: string) => {
      this.loader.hide();

      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }

  public clearUserForm(): void {
    this.createUserOpen = false;

    this.userFormData = {
      gender: null,
      title: "",
      name: "",
      surname: "",
      position_id: null
    };
  }

  public userUpdated(): void {
    if (this.user.details) {
      this.loader.show();

      let update: Object = {};

      if (this.user.details.name !== this.userEditFormData.name) {
        update['name'] = this.userEditFormData.name;
      }

      if (this.user.details.surname !== this.userEditFormData.surname) {
        update['surname'] = this.userEditFormData.surname;
      }

      if (this.user.details.title !== this.userEditFormData.title) {
        update['title'] = this.userEditFormData.title;
      }

      if (this.user.details.position_id !== this.userEditFormData.position_id) {
        update['position_id'] = Number(this.userEditFormData.position_id);
      }

      if (Object.keys(update).length > 0) {
        this.user.update(update).then(() => {
          this.flash.show({
            content: this.translate.instant("settings.USER_EDIT_SUCCESS"),
            type: "success"
          });

          this.user.get().then((data: UserDetailsInterface) => {
            this.loader.hide();

            this.user.details = data;

            this.user.$onLoad.emit();
          }, () => {
            this.loader.hide();
          });
        }, (err: string) => {
          this.loader.hide();

          this.flash.show({
            content: this.translate.instant("error." + err),
            type: "danger"
          });
        });
      } else {
        this.loader.hide();
      }
    }
  }

  public deleteUser(userId: number): void {
    if (this.user.details && this.user.details.id === userId) {
      return;
    }

    this.modal.show({
      title: "settings.DELETE_USER",
      content: "settings.CONFIRM_DELETE_USER",
      translate: true,
      buttons: [
        {
          text: "general.YES",
          callback: (modal: NgbModalRef): void => {
            this.loader.show();

            this.user.erase(userId).then(() => {
              modal.dismiss();

              this.flash.show({
                content: this.translate.instant("settings.USER_DELETED"),
                type: "success"
              });

              this.user.list().then((data: UserDetailsInterface[]) => {
                this.loader.hide();

                this.userList = data;
              }, () => {
                this.loader.hide();
              });
            }, (err: string) => {
              this.loader.hide();

              this.flash.show({
                content: this.translate.instant("error." + err),
                type: "danger"
              });

              modal.dismiss();
            });
          }
        },
        {
          text: "general.NO"
        }
      ]
    });
  }

  public isPracticeChange(): boolean {
    let changed: boolean = false;

    for (let key in this.practiceEditFormData) {
      if (this.practice.details === null || this.practiceEditFormData[key] !== this.practice.details[key]) {
        changed = true;
      }
    }

    return changed;
  }

  public updatePractice(): void {
    if (this.user.details) {
      this.loader.show();

      let update: Object = {};

      if (this.practice.details.company !== this.practiceEditFormData.company) {
        update['company'] = this.practiceEditFormData.company;
      }

      if (this.practice.details.address !== this.practiceEditFormData.address) {
        update['address'] = this.practiceEditFormData.address;
      }

      if (this.practice.details.phone !== this.practiceEditFormData.phone) {
        update['phone'] = this.practiceEditFormData.phone;
      }

      if (this.practice.details.contact_email !== this.practiceEditFormData.contact_email) {
        update['contact_email'] = this.practiceEditFormData.contact_email;
      }

      if (this.practice.details.webpages !== this.practiceEditFormData.webpages) {
        update['webpages'] = this.practiceEditFormData.webpages;
      }

      if (this.practice.details.language_id !== this.practiceEditFormData.language_id) {
        update['language_id'] = Number(this.practiceEditFormData.language_id);
      }

      if (this.practice.details.system_email !== this.practiceEditFormData.system_email) {
        update['system_email'] = this.practiceEditFormData.system_email;
      }

      if (Object.keys(update).length > 0) {
        this.practice.update(update).then(() => {
          this.flash.show({
            content: this.translate.instant("settings.PRACTICE_SAVED"),
            type: "success"
          });

          this.practice.get().then((data: PracticeDetailsInterface) => {
            this.loader.hide();

            this.practice.details = data;

            this.practice.$onLoad.emit();
          }, () => {
            this.loader.hide();
          });
        }, (err: string) => {
          this.loader.hide();

          this.flash.show({
            content: this.translate.instant("error." + err),
            type: "danger"
          });
        });
      } else {
        this.loader.hide();
      }
    }
  }

  public sendClientLogins(): void {
    //@TODO
  }
}
