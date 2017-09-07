import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Variables} from "../app/variables";
import {AuthProvider} from "./auth-provider";

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

@Injectable()
export class PracticeProvider {
  constructor(private http: HttpClient,
              private auth: AuthProvider) {

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
        resolve();
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

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
        resolve(data.address);
      }, (error: HttpErrorResponse) => {
        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        reject(msg);
      });
    });
  }
}
