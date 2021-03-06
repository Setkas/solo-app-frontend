import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {Variables} from "../../app/variables";
import {ClientDetailsInterface, ClientProvider, SearchResultInterface} from "../../providers/client-provider";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";
import {LoaderProvider} from "../../components/loader-component/loader-provider";
import {TermDataInterface, TermProvider} from "../../providers/term-provider";
import {SetupProvider} from "../../providers/setup-provider";
import {UtilsProvider} from "../../providers/utils-provider";
import {Subscription} from "rxjs/Subscription";
import * as Moment from "moment";

@Component({
  selector: 'client-page',
  templateUrl: 'client-page.html',
  styleUrls: [
    'client-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ClientPage implements OnInit, OnDestroy {
  public clientSearch: string = "";

  private searchTimeout: any = null;

  public searchResultList: SearchResultInterface[] = [];

  public genderList: {id: number, name: string}[] = Variables.genderList;

  public formData: {gender: string, birth_date: string, name: string, surname: string, phone: string, email: string, address: string} = {
    gender: null,
    birth_date: "",
    name: "",
    surname: "",
    phone: "",
    email: "",
    address: ""
  };

  public editFormData: {gender: string, birth_date: string, name: string, surname: string, phone: string, email: string, address: string} = {
    gender: null,
    birth_date: "",
    name: "",
    surname: "",
    phone: "",
    email: "",
    address: ""
  };

  public termHistory: {name: string, bob: string, term: TermDataInterface}[] = [];

  public isSearching: boolean = false;

  private subs: Subscription[] = [];

  constructor(public client: ClientProvider,
              private term: TermProvider,
              private setup: SetupProvider,
              private flash: FlashProvider,
              private translate: TranslateService,
              private loader: LoaderProvider) {
    this.subs.push(client.$onSelected.subscribe(() => {
      this.loadClientData();
    }));

    this.subs.push(client.$onDeSelected.subscribe(() => {
      this.clearEditForm();
    }));

    this.subs.push(term.$onLoad.subscribe(() => {
      this.loadTerms();
    }));
  }

  ngOnInit() {
    if (this.client.details !== null) {
      this.loadClientData();
    }

    if (this.term.activeTerm !== null) {
      this.loadTerms();
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  private clearEditForm(): void {
    this.editFormData = {
      gender: null,
      birth_date: "",
      name: "",
      surname: "",
      phone: "",
      email: "",
      address: ""
    };
  }

  private clearForm(): void {
    this.formData = {
      gender: null,
      birth_date: "",
      name: "",
      surname: "",
      phone: "",
      email: "",
      address: ""
    };
  }

  private loadTerms(): void {
    this.termHistory = [];

    this.term.termHistory.forEach((data: TermDataInterface, index: number) => {
      if (this.termHistory.length <= this.setup.current.client_history && !Moment().isSame(Moment.utc(data.date), "d")) {
        this.termHistory.push({
          name: this.translate.instant("general.SOLO") + "-" + (this.term.termHistory.length - index),
          bob: UtilsProvider.CountBob(data.teeth, data.bleed_middle).join("|"),
          term: data
        });
      }
    });
  }

  private loadClientData(): void {
    let source: ClientDetailsInterface = JSON.parse(JSON.stringify(this.client.details));

    this.editFormData = {
      gender: source.gender,
      birth_date: source.birth_date,
      name: source.name,
      surname: source.surname,
      phone: source.phone,
      email: source.email,
      address: source.address
    };
  }

  public findClients(search: string): void {
    this.clearTimeout();

    this.isSearching = true;

    if (search.length > 0) {
      this.searchTimeout = setTimeout(() => {
        this.clearTimeout();

        this.client.search(search).then((list: SearchResultInterface[]) => {
          this.searchResultList = list;

          this.isSearching = false;
        }, () => {
          this.searchResultList = [];

          this.isSearching = false;
        });
      }, Variables.searchTimeout * 1000);
    } else {
      this.searchResultList = [];

      this.isSearching = false;
    }
  }

  private clearTimeout(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = null;
    }
  }

  public createClient(): void {
    this.loader.show();

    this.client.create({
      gender: this.formData.gender,
      birth_date: this.formData.birth_date,
      name: this.formData.name,
      surname: this.formData.surname,
      phone: this.formData.phone,
      email: this.formData.email,
      address: this.formData.address
    }).then((clientId: number) => {
      this.loader.hide();

      this.clearForm();

      this.flash.show({
        content: this.translate.instant("client.NEW_CLIENT_CREATED"),
        type: "success"
      });

      this.client.select(clientId).catch(() => {

      });
    }, (err: string) => {
      this.loader.hide();

      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }

  public selectClient(clientId: number): void {
    this.loader.show();

    this.client.select(clientId).then(() => {
      this.searchResultList = [];

      this.clientSearch = "";

      this.loader.hide();
    }, () => {
      this.flash.show({
        content: this.translate.instant("error.SELECT_CLIENT_ERROR"),
        type: "danger"
      });

      this.loader.hide();
    });
  }

  public unSelectClient(): void {
    this.searchResultList = [];

    this.clientSearch = "";

    this.client.unSelect();
  }

  public areChanges(): boolean {
    let changed: boolean = false;

    for (let key in this.editFormData) {
      if (this.client.details === null || this.editFormData[key] !== this.client.details[key]) {
        changed = true;
      }
    }

    return changed;
  }

  public updateClient(): void {
    if (this.client.details) {
      this.loader.show();

      let update: Object = {};

      if (this.client.details.name !== this.editFormData.name || this.client.details.surname !== this.editFormData.surname) {
        update['name'] = this.editFormData.name;

        update['surname'] = this.editFormData.surname;
      }

      if (this.client.details.address !== this.editFormData.address) {
        update['address'] = this.editFormData.address;
      }

      if (this.client.details.email !== this.editFormData.email) {
        update['email'] = this.editFormData.email;
      }

      if (this.client.details.phone !== this.editFormData.phone) {
        update['phone'] = this.editFormData.phone;
      }

      if (this.client.details.gender !== this.editFormData.gender) {
        update['gender'] = this.editFormData.gender;
      }

      if (this.client.details.birth_date !== this.editFormData.birth_date) {
        update['birth_date'] = this.editFormData.birth_date;
      }

      if (Object.keys(update).length > 0) {
        this.client.update(this.client.details.id, update).then(() => {
          this.flash.show({
            content: this.translate.instant("settings.CLIENT_EDIT_SUCCESS"),
            type: "success"
          });

          this.client.get(this.client.details.id).then((data: ClientDetailsInterface) => {
            this.loader.hide();

            this.client.details = data;

            this.client.$onSelected.emit();
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
}
