import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Variables} from "../app/variables";
import {AuthProvider} from "./auth-provider";
import {LoggerProvider} from "./logger-provider";

export interface UserDetailsInterface {
  id: number,
  practice_id: number,
  position_id: number,
  code: number,
  name: string,
  surname: string,
  title: string,
  authorization: string,
  gender: number
  deleted: string,
  reset_password: boolean
}

export interface CreateUserDataInterface {
  title: string,
  name: string,
  surname: string,
  gender: string,
  position_id: number
}

@Injectable()
export class UserProvider {
  public details: UserDetailsInterface = null;

  public $onLoad: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient,
              private auth: AuthProvider) {
  }

  public get(): Promise<UserDetailsInterface> {
    return new Promise((resolve: (details: UserDetailsInterface) => void, reject: (err: string) => void) => {
      this.http.get<UserDetailsInterface>(Variables.apiUrl + "/user", {
        headers: this.auth.appendHeader()
      }).subscribe((data: UserDetailsInterface) => {
        LoggerProvider.Log("[USER]: Loaded user details data for logged in user.");

        resolve(data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[USER]: Could not load user details for logged in user.");

        reject(msg);
      });
    });
  }

  public list(): Promise<UserDetailsInterface[]> {
    return new Promise((resolve: (details: UserDetailsInterface[]) => void, reject: (err: string) => void) => {
      this.http.get<UserDetailsInterface[]>(Variables.apiUrl + "/users", {
        headers: this.auth.appendHeader()
      }).subscribe((data: UserDetailsInterface[]) => {
        LoggerProvider.Log("[USER]: Loaded user list data for current practice.");

        resolve(data);
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[USER]: Could not load user list for current practice.");

        reject(msg);
      });
    });
  }

  public erase(userId: number): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: string) => void) => {
      this.http.delete<void>(Variables.apiUrl + "/user/" + encodeURIComponent(userId.toString()), {
        headers: this.auth.appendHeader()
      }).subscribe(() => {
        LoggerProvider.Log("[USER]: Deleted user by ID (id_user: " + userId + ").");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[USER]: Could not delete user by ID (id_user: " + userId + ").");

        reject(msg);
      });
    });
  }

  public update(data: {position_id?: number, password?: string, title?: string, name?: string, surname?: string, gender?: string, reset_password?: boolean}): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: string) => void) => {
      this.http.patch<void>(Variables.apiUrl + "/user", data, {
        headers: this.auth.appendHeader()
      }).subscribe(() => {
        LoggerProvider.Log("[USER]: Updated current user's data.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[USER]: Could not update current user's data.");

        reject(msg);
      });
    });
  }

  public create(data: CreateUserDataInterface): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: string) => void) => {
      this.http.post<void>(Variables.apiUrl + "/user", data, {
        headers: this.auth.appendHeader()
      }).subscribe(() => {
        LoggerProvider.Log("[USER]: Created new user for current practice.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.auth.handleHttpError(error);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[USER]: Created new user for current practice.");

        reject(msg);
      });
    });
  }
}
