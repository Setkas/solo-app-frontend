import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Variables} from "../app/variables";
import {AuthProvider} from "./auth-provider";
import {LoggerProvider} from "./logger-provider";

export interface SetupDataInterface {
  client_history?: number,
  client_reminder?: number,
  notes_history?: number,
  therapy_color?: number
}

@Injectable()
export class SetupProvider {
  public current: SetupDataInterface = null;

  public $onLoad: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient,
              private auth: AuthProvider) {
  }

  public get(): Promise<SetupDataInterface> {
    return new Promise((resolve: (data: SetupDataInterface) => void, reject: (err: string) => void) => {
      this.http.get<SetupDataInterface>(Variables.apiUrl + "/setup", {
        headers: this.auth.appendHeader()
      }).subscribe((data: SetupDataInterface | Array<void>) => {
        LoggerProvider.Log("[SETUP]: Loaded practice setup data for logged in user.");

        if (Array.isArray(data)) {
          data = {};
        }

        resolve(data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[SETUP]: Could not load practice setup data for logged in user.");

        reject(msg);
      });
    });
  }

  public patch(data: SetupDataInterface): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      let updateData: Object = {};

      if (data.client_history) {
        updateData['client_history'] = Number(data.client_history);
      }

      if (data.client_reminder) {
        updateData['client_reminder'] = Number(data.client_reminder);
      }

      if (data.notes_history) {
        updateData['notes_history'] = Number(data.notes_history);
      }

      if (data.therapy_color) {
        updateData['therapy_color'] = Number(data.therapy_color);
      }

      this.http.patch<void>(Variables.apiUrl + "/setup", updateData, {
        headers: this.auth.appendHeader()
      }).subscribe(() => {
        LoggerProvider.Log("[SETUP]: Saved practice setup data for logged in user.");

        resolve();
      }, (error: HttpErrorResponse) => {
        //this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[SETUP]: Could not save practice setup data for logged in user.");

        reject(msg);
      });
    });
  }
}
