import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Variables} from "../../app/variables";
import {ClientDetailsInterface, ClientProvider, SearchResultInterface} from "../../providers/client-provider";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";
import {LoaderProvider} from "../../components/loader-component/loader-provider";

@Component({
  selector: 'client-page',
  templateUrl: 'client-page.html',
  styleUrls: [
    'client-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ClientPage implements OnInit {
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

  public isSearching: boolean = false;

  constructor(public client: ClientProvider,
              private flash: FlashProvider,
              private translate: TranslateService,
              private loader: LoaderProvider) {
    client.$onSelected.subscribe(() => {
      this.editFormData = {
        gender: this.client.details.gender,
        birth_date: this.client.details.birth_date,
        name: this.client.details.name,
        surname: this.client.details.surname,
        phone: this.client.details.phone,
        email: this.client.details.email,
        address: this.client.details.address
      };
    });

    client.$onDeSelected.subscribe(() => {
      this.editFormData = {
        gender: null,
        birth_date: "",
        name: "",
        surname: "",
        phone: "",
        email: "",
        address: ""
      };
    });
  }

  ngOnInit() {
    if (this.client.details !== null) {
      this.editFormData = {
        gender: this.client.details.gender,
        birth_date: this.client.details.birth_date,
        name: this.client.details.name,
        surname: this.client.details.surname,
        phone: this.client.details.phone,
        email: this.client.details.email,
        address: this.client.details.address
      };
    }
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

      this.formData = {
        gender: null,
        birth_date: "",
        name: "",
        surname: "",
        phone: "",
        email: "",
        address: ""
      };

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
