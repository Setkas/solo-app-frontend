import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Variables} from "../app/variables";
import {AuthProvider} from "./auth-provider";
import {LoggerProvider} from "./logger-provider";
import {ClientProvider} from "./client-provider";
import * as Moment from "moment";

export interface TermDataInterface {
  id: number,
  client_id: number,
  date: string,
  teeth: string[],
  bleed_inner: boolean[],
  bleed_outer: boolean[],
  bleed_middle: boolean[],
  stix: number[],
  pass: number[],
  tartar: boolean[],
  next_date: string,
  note: string
}

@Injectable()
export class TermProvider {
  public termHistory: TermDataInterface[] = [];

  public activeTerm: TermDataInterface = null;

  public $onLoad: EventEmitter<void> = new EventEmitter<void>();

  private saveInitiated: any = null;

  constructor(private http: HttpClient,
              private auth: AuthProvider,
              private client: ClientProvider) {
    this.client.$onDeSelected.subscribe(() => {
      this.activeTerm = null;

      this.termHistory = [];
    });
  }

  public get(): Promise<TermDataInterface[]> {
    return new Promise((resolve: (data: TermDataInterface[]) => void, reject: (err: string) => void) => {
      if (!this.client.details) {
        reject("NO_CLIENT_SELECTED");
      } else {
        this.http.get<TermDataInterface[]>(Variables.apiUrl + "/terms/" + encodeURIComponent(this.client.details.id.toString()), {
          headers: this.auth.appendHeader()
        }).subscribe((data: TermDataInterface[]) => {
          LoggerProvider.Log("[TERM]: Loaded term list data for loaded client by ID (id_client: " + this.client.details.id + ").");

          resolve(data);
        }, (error: HttpErrorResponse) => {
          this.auth.handleHttpError(error);

          let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

          LoggerProvider.Error("[TERM]: Could not load term list data for loaded client by ID (id_client: " + this.client.details.id + ").");

          reject(msg);
        });
      }
    });
  }

  public post(data: TermDataInterface): Promise<number> {
    return new Promise((resolve: (id: number) => void, reject: (err: string) => void) => {
      if (!this.client.details || data.id) {
        reject("NO_CLIENT_SELECTED");
      } else {
        let newData: Object = JSON.parse(JSON.stringify(data));

        delete newData['id'];

        delete newData['client_id'];

        this.http.post<{code: number, message: string, data: number}>(Variables.apiUrl + "/term/" + encodeURIComponent(this.client.details.id.toString()), newData, {
          headers: this.auth.appendHeader()
        }).subscribe((res: {code: number, message: string, data: number}) => {
          LoggerProvider.Log("[TERM]: Saved active term by client ID (id_client: " + this.client.details.id + ").");

          resolve(res.data);
        }, (error: HttpErrorResponse) => {
          //this.auth.handleHttpError(error);

          let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

          LoggerProvider.Error("[TERM]: Could not save active term by client ID (id_client: " + this.client.details.id + ").");

          reject(msg);
        });
      }
    });
  }

  public patch(data: Object): Promise<number> {
    return new Promise((resolve: (id: number) => void, reject: (err: string) => void) => {
      if (!this.client.details || !data["id"]) {
        reject("NO_CLIENT_SELECTED");
      } else {
        let newData: Object = JSON.parse(JSON.stringify(data));

        delete newData['id'];

        delete newData['client_id'];

        delete newData['date'];

        this.http.patch<{code: number, message: string, data: number}>(Variables.apiUrl + "/term/" + encodeURIComponent(this.client.details.id.toString()) + "/" + encodeURIComponent(data["id"].toString()), newData, {
          headers: this.auth.appendHeader()
        }).subscribe((res: {code: number, message: string, data: number}) => {
          LoggerProvider.Log("[TERM]: Saved active term by ID (id_term: " + data["id"] + ").");

          resolve(res.data);
        }, (error: HttpErrorResponse) => {
          //this.auth.handleHttpError(error);

          let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

          LoggerProvider.Error("[TERM]: Could not save active term by ID (id_term: " + data["id"] + ").");

          reject(msg);
        });
      }
    });
  }

  public save(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: string) => void) => {
      if (!this.activeTerm) {
        reject("NO_CLIENT_SELECTED");
      } else {
        if (this.saveInitiated !== null) {
          clearTimeout(this.saveInitiated);
        }

        this.saveInitiated = setTimeout(() => {
          if (this.activeTerm.id) {
            let update: Object = {};

            for (let key in this.activeTerm) {
              console.log();

              if (JSON.stringify(this.activeTerm[key]) !== JSON.stringify(this.termHistory[0][key])) {
                update[key] = this.activeTerm[key];
              }
            }

            if (Object.keys(update).length > 0) {
              update["id"] = this.activeTerm.id;

              this.patch(update).then(() => {
                this.termHistory[0] = JSON.parse(JSON.stringify(this.activeTerm));

                resolve();
              }, (err: string) => {
                reject(err);
              });
            } else {
              resolve();
            }
          } else {
            this.post(this.activeTerm).then((id: number) => {
              this.activeTerm.id = id;

              this.termHistory.unshift(JSON.parse(JSON.stringify(this.activeTerm)));

              resolve();
            }, (err: string) => {
              reject(err);
            });
          }

          this.saveInitiated = null;
        }, Variables.saveTimeout * 1000);
      }
    });
  }

  public generateEmpty(): TermDataInterface {
    if (!this.client.details) {
      return null;
    }

    let teeth: string[] = [],
      bleed: boolean[] = [],
      bleedMid: boolean[] = [],
      stix: number[] = [];

    for (let i = 0; i < 32; i++) {
      teeth.push("1");

      bleed.push(false);
    }

    for (let i = 0; i < 30; i++) {
      stix.push(0);

      bleedMid.push(false);
    }

    return {
      id: null,
      client_id: this.client.details.id,
      date: Moment().toISOString(),
      teeth: JSON.parse(JSON.stringify(teeth)),
      bleed_inner: JSON.parse(JSON.stringify(bleed)),
      bleed_outer: JSON.parse(JSON.stringify(bleed)),
      bleed_middle: JSON.parse(JSON.stringify(bleedMid)),
      stix: JSON.parse(JSON.stringify(stix)),
      pass: JSON.parse(JSON.stringify(stix)),
      tartar: [
        false,
        false,
        false,
        false
      ],
      next_date: Moment().add(1, "month").toISOString(),
      note: ""
    };
  }
}
