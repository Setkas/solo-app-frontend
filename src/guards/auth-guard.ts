import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthProvider} from "../providers/auth-provider";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthProvider) {

  }

  canActivate() {
    let result: boolean = this.isLoggedIn();

    if (!result) {
      this.router.navigate([
        '/login'
      ]);
    }

    return result;
  }

  private isLoggedIn(): boolean {
    return this.auth.isAuthorized() || this.auth.isLogin();
  }
}
