import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Variables} from "../app/variables";
import {AuthProvider} from "./auth-provider";
import {LoggerProvider} from "./logger-provider";

export interface RegisterDataInterface {
  company: string,
  address: string
  phone: string,
  contact_email: string,
  webpages?: string,
  language_id: number,
  password: string,
  title?: string,
  name: string,
  surname: string,
  position_id: number,
  gender: string,
  code?: string
}

export interface ConnectDataInterface {
  username: string,
  password: string
}

export interface ConnectResponseInterface {
  amzip: string,
  amcity: string,
  amtitle: string,
  amfirstname: string,
  amlastname: string,
  ammobile: string,
  amemail: string,
  amgender: string,
  amcompany1: string,
  amstreet1: string,
  amstreet2: string
}

export interface PracticeDetailsInterface {
  id: number,
  language_id: number,
  company: string,
  address: string,
  code: string,
  phone: string,
  webpages: string,
  contact_email: string,
  system_email: string,
  valid: string,
  valid_reminder: boolean,
  monthly_reminder: string,
  deleted: string,
  changes_reminder: string,
  client_login: boolean
}

@Injectable()
export class PracticeProvider {
  public details: PracticeDetailsInterface = null;

  public $onLoad: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient,
              private auth: AuthProvider) {
  }

  public get(): Promise<PracticeDetailsInterface> {
    return new Promise((resolve: (details: PracticeDetailsInterface) => void, reject: (err: string) => void) => {
      this.http.get<PracticeDetailsInterface>(Variables.apiUrl + "/practice", {
        headers: this.auth.appendHeader()
      }).subscribe((data: PracticeDetailsInterface) => {
        LoggerProvider.Log("[PRACTICE]: Loaded practice details data for logged in user.");

        resolve(data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[PRACTICE]: Could not load practice details for logged in user.");

        reject(msg);
      });
    });
  }

  public register(data: RegisterDataInterface): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      if (!data.title) {
        delete data.title;
      }

      if (!data.webpages) {
        delete data.webpages;
      }

      this.http.post<void>(Variables.apiUrl + "/practice", data).subscribe(() => {
        LoggerProvider.Log("[PRACTICE]: Registered new user and practice combination.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[PRACTICE]: Could not register new user and practice combination.");

        reject(msg);
      });
    });
  }

  public connect(data: ConnectDataInterface): Promise<ConnectResponseInterface> {
    return new Promise((resolve: (ConnectResponseInterface) => void, reject: (err: string) => void) => {
      this.http.post<{address: ConnectResponseInterface}>(Variables.soloMed.apiUrl, {
        apiKey: Variables.soloMed.apiKey,
        localSite: "main",
        userName: data.username,
        passWord: data.password
      }).subscribe((data: {address: ConnectResponseInterface}) => {
        LoggerProvider.Log("[PRACTICE]: Loaded solo-med.de user details for registration form.");

        resolve(data.address);
      }, (error: HttpErrorResponse) => {
        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[PRACTICE]: Could not load solo-med.de user details.");

        reject(msg);
      });
    });
  }

  public update(data: {company?: string, address?: string, phone?: string, contact_email?: string, webpages?: string, language_id?: number, system_email?: string}): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      this.http.patch<void>(Variables.apiUrl + "/practice", data, {headers: this.auth.appendHeader()}).subscribe(() => {
        LoggerProvider.Log("[PRACTICE]: Saved updated practice data for current user.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[PRACTICE]: Could not save update practice data for current user.");

        reject(msg);
      });
    });
  }
}
