import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {AuthProvider} from "./auth-provider";
import {Variables} from "../app/variables";
import {LoggerProvider} from "./logger-provider";
import {CookieService} from "ngx-cookie-service";
import * as Moment from "moment";

export interface SearchResultInterface {
  id: number,
  name: string,
  surname: string,
  address: string,
  birth_date: string
}

export interface ClientDetailsInterface {
  id: number,
  practice_id: number
  name: string,
  surname: string,
  address: string,
  birth_date: string,
  email: string,
  phone: string,
  gender: string,
  password: boolean,
  deleted: string,
  changes_reminder: string
}

@Injectable()
export class ClientProvider {
  public details: ClientDetailsInterface = null;

  public $onSelected: EventEmitter<void> = new EventEmitter<void>();

  public $onDeSelected: EventEmitter<void> = new EventEmitter<void>();

  private cookieKey: string = Variables.cookiePrefix + "selected_client";

  constructor(private http: HttpClient,
              private auth: AuthProvider,
              private cookie: CookieService) {
    this.auth.$onLogout.subscribe(() => {
      this.unSelect();
    });

    if (this.auth.isAuthorized()) {
      this.checkStorage();
    }

    this.auth.$onLogin.subscribe(() => {
      this.checkStorage();
    });
  }

  public search(query: string): Promise<SearchResultInterface[]> {
    return new Promise((resolve: (data: SearchResultInterface[]) => void, reject: (err: string) => void) => {
      this.http.get<SearchResultInterface[]>(Variables.apiUrl + "/client-search", {
        headers: this.auth.appendHeader(),
        params: new HttpParams().append("query", query).append("limit", "5")
      }).subscribe((data: SearchResultInterface[]) => {
        LoggerProvider.Log("[CLIENT]: Loaded clients for search query '" + query + "'.");

        resolve(data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[CLIENT]: Could not load clients for query '" + query + "'.");

        reject(msg);
      });
    });
  }

  public create(data: {gender: string, birth_date: string, name: string, surname: string, phone: string, email: string, address: string}): Promise<number> {
    let keys: string[] = Object.keys(data);

    if (keys.indexOf("email") >= 0 && data.email.length === 0) {
      delete data.email;
    }

    if (keys.indexOf("phone") >= 0 && data.phone.length === 0) {
      delete data.phone;
    }

    return new Promise((resolve: (clientID: number) => void, reject: (err: string) => void) => {
      this.http.post<{code: number, messsage: string, data: number}>(Variables.apiUrl + "/client", data, {
        headers: this.auth.appendHeader()
      }).subscribe((data: {code: number, messsage: string, data: number}) => {
        LoggerProvider.Log("[CLIENT]: Successfully created new client.");

        resolve(data.data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[CLIENT]: Could not create new client.");

        reject(msg);
      });
    });
  }

  public get(clientId: number): Promise<ClientDetailsInterface> {
    return new Promise((resolve: (data: ClientDetailsInterface) => void, reject: (err: string) => void) => {
      this.http.get<ClientDetailsInterface>(Variables.apiUrl + "/client/" + encodeURIComponent(clientId.toString()), {
        headers: this.auth.appendHeader()
      }).subscribe((data: ClientDetailsInterface) => {
        LoggerProvider.Log("[CLIENT]: Successfully loaded client details by ID (id_client: " + clientId + ").");

        resolve(data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[CLIENT]: Could not load client details by ID (id_client: " + clientId + ").");

        reject(msg);
      });
    });
  }

  public update(clientId: number, data: {gender?: string, birth_date?: string, name?: string, surname?: string, phone?: string, email?: string, address?: string}): Promise<void> {
    let keys: string[] = Object.keys(data);

    if (keys.indexOf("email") >= 0 && data.email.length === 0) {
      delete data.email;
    }

    if (keys.indexOf("phone") >= 0 && data.phone.length === 0) {
      delete data.phone;
    }

    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      this.http.patch<void>(Variables.apiUrl + "/client/" + encodeURIComponent(clientId.toString()), data, {
        headers: this.auth.appendHeader()
      }).subscribe(() => {
        LoggerProvider.Log("[CLIENT]: Successfully updated client data by ID (id_client: " + clientId + ").");

        resolve();
      }, (error: HttpErrorResponse) => {
        //this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[CLIENT]: Could not update client data by ID (id_client: " + clientId + ").");

        reject(msg);
      });
    });
  }

  public select(clientId: number): Promise<void> {
    this.unSelect();

    return new Promise<void>((resolve: () => void, reject: () => void) => {
      this.get(clientId).then((data: ClientDetailsInterface) => {
        LoggerProvider.Log("[CLIENT]: Successfully selected client by ID (id_client: " + clientId + ").");

        this.details = data;

        this.$onSelected.emit();

        this.cookie.set(this.cookieKey, clientId.toString(), Moment().add(1, "days").utc().toDate());

        resolve();
      }, () => {
        LoggerProvider.Error("[CLIENT]: Could not select client by ID (id_client: " + clientId + ").");

        reject();
      });
    });
  }

  public unSelect(clearSession: boolean = false): void {
    if (this.details !== null) {
      this.details = null;

      this.$onDeSelected.emit();

      this.cookie.delete(this.cookieKey);

      LoggerProvider.Log("[CLIENT]: Current active user was successfully deselected.");
    } else if (clearSession) {
      this.cookie.delete(this.cookieKey);
    }
  }

  private checkStorage(): void {
    if (this.cookie.check(this.cookieKey)) {
      let value: string = this.cookie.get(this.cookieKey);

      if (value) {
        this.select(parseInt(value)).catch(() => {
          LoggerProvider.Error("[CLIENT]: Unable to select saved client from storage.");

          this.unSelect(true);
        });
      } else {
        LoggerProvider.Error("[CLIENT]: Unable to load saved client data.");

        this.unSelect(true);

        return null;
      }
    } else {
      LoggerProvider.Log("[CLIENT]: No saved client data found in storage.");

      return null;
    }
  }
}
