import {Injectable, EventEmitter} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Variables} from "../app/variables";
import {CookieService} from "ngx-cookie-service";
import * as Moment from "moment";
import {LoggerProvider} from "./logger-provider";
import {Router} from "@angular/router";

declare const window: Window;

export interface AuthTokenData {
  token: string,
  expire: string,
  authorization: string
}

@Injectable()
export class AuthProvider {
  public $onLogin: EventEmitter<void> = new EventEmitter<void>();

  public $onLogout: EventEmitter<void> = new EventEmitter<void>();

  private authData: AuthTokenData = null;

  private cookieKey: string = Variables.cookiePrefix + "session";

  private expireInterval: any = null;

  constructor(private http: HttpClient,
              private cookie: CookieService,
              private router: Router) {

  }

  public isAuthorized(): boolean {
    return this.authData !== null && Moment().isBefore(Moment.utc(this.authData.expire));
  }

  public appendHeader(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    if (this.isAuthorized()) {
      headers = headers.append("Authorization", this.authData.token);
    } else {
      LoggerProvider.Warning("[AUTH]: Unable to append authorization header.");
    }

    return headers;
  }

  public login(practice: string, user: number, password: string): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      this.http.post<AuthTokenData>(Variables.apiUrl + "/login", {
        practice: practice,
        user: user,
        password: password
      }).subscribe((data: AuthTokenData) => {
        this.authData = data;

        this.saveSession(data);

        this.setExpire(Moment.utc(data.expire));

        this.$onLogin.emit();

        LoggerProvider.Log("[AUTH]: System online login was successful.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.handleHttpError(error, [401]);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        reject(msg);
      });
    });
  }

  public isLogin(): boolean {
    let data: AuthTokenData = this.getSession();

    if (data) {
      this.authData = data;

      this.setExpire(Moment.utc(data.expire));

      this.$onLogin.emit();

      LoggerProvider.Log("[AUTH]: System refresh login was successful.");

      return true;
    } else {
      return false;
    }
  }

  public logout(): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      this.clearSession();

      this.clearExpire();

      this.authData = null;

      this.$onLogout.emit();

      LoggerProvider.Log("[AUTH]: System logout was successful.");

      resolve();
    });
  }

  public handleHttpError(error: HttpErrorResponse, excluded: number[] = []): boolean {
    if (Variables.invalidStatusCodes.indexOf(error.status) >= 0 && excluded.indexOf(error.status) < 0) {
      this.logout().then(() => {
        this.router.navigate([
          "/login"
        ]);
      });

      LoggerProvider.Log("[AUTH]: HTTP error code " + error.status + " detected, forcing application shutdown.");

      return true;
    } else {
      return false;
    }
  }

  private saveSession(data: AuthTokenData): void {
    this.cookie.set(this.cookieKey, JSON.stringify(data), Moment.utc(data.expire).toDate());
  }

  private getSession(): AuthTokenData {
    if (this.cookie.check(this.cookieKey)) {
      let value: string = this.cookie.get(this.cookieKey);

      if (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          LoggerProvider.Error("[AUTH]: Unable to parse session data.");

          this.clearSession();

          return null;
        }
      } else {
        LoggerProvider.Error("[AUTH]: Unable to load session data.");

        this.clearSession();

        return null;
      }
    } else {
      LoggerProvider.Log("[AUTH]: No session data found in storage.");

      return null;
    }
  }

  private clearSession(): void {
    if (this.cookie.check(this.cookieKey)) {
      LoggerProvider.Log("[AUTH]: Deleted saved session data from storage.");

      this.cookie.delete(this.cookieKey);
    } else {
      LoggerProvider.Warning("[AUTH]: No session data found in storage to delete.");
    }
  }

  private setExpire(time: Moment.Moment): void {
    this.clearExpire();

    this.expireInterval = setTimeout(() => {
      LoggerProvider.Error("[AUTH]: Validity of current session has expired.");

      this.logout().then(() => {
        this.router.navigate([
          "/login"
        ]);
      });
    }, time.diff(Moment(), 'ms'));

    LoggerProvider.Log("[AUTH]: Session expire time interval (" + time.toISOString() + ") was started.");
  }

  private clearExpire(): void {
    if (this.expireInterval) {
      clearTimeout(this.expireInterval);

      this.expireInterval = null;

      LoggerProvider.Log("[AUTH]: Session expire time interval was stopped.");
    }
  }

  public forgotPassword(practice: string, user: number): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      this.http.post<{code: number, message: string}>(Variables.apiUrl + "/password-reset", {
        practice: practice,
        user: user,
        url: window.location.href
      }).subscribe(() => {
        LoggerProvider.Log("[AUTH]: Password reset token was generated and sent to associated email.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.handleHttpError(error, []);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[AUTH]: Could not generate password reset token and send to email address.");

        reject(msg);
      });
    });
  }

  public newPassword(token: string, password: string): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: string) => void) => {
      this.http.post<{code: number, message: string}>(Variables.apiUrl + "/password-update", {
        token: token,
        password: password
      }).subscribe((data: {code: number, message: string}) => {
        LoggerProvider.Log("[AUTH]: New password was set for user by token.");

        resolve();
      }, (error: HttpErrorResponse) => {
        this.handleHttpError(error, []);

        let msg: string = (error && error.error && error.error.message) ? error.error.message : null;

        LoggerProvider.Error("[AUTH]: Could not update password by token.");

        reject(msg);
      });
    });
  }

  public hasAuthorization(requiredAuth: string): boolean {
    if (this.authData === null || !Variables.authLevels[requiredAuth] || !Variables.authLevels[this.authData.authorization]) {
      return false;
    }

    let value: number = Variables.authLevels[requiredAuth],
      currentAuth: number = Variables.authLevels[this.authData.authorization];

    return currentAuth >= value;
  }
}
