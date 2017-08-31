import {Component, ViewEncapsulation} from '@angular/core';
import {AuthProvider} from "../../providers";
import {LoaderProvider} from "../../components/loader-component/loader-provider";
import {Router} from "@angular/router";

export interface LoginDetailsInterface {
  practice: string,
  user: number,
  password: string
}

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html',
  styleUrls: [
    'login-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage {
  public formData: LoginDetailsInterface = {
    practice: "",
    user: null,
    password: ""
  };

  constructor(private auth: AuthProvider,
              private loader: LoaderProvider,
              private router: Router) {
    if (this.auth.isAuthorized()) {
      this.router.navigate([
        "/home"
      ]);
    }

    this.auth.$onLogin.subscribe(() => {
      this.router.navigate([
        "/home"
      ]);
    });

    this.auth.isLogin();
  }

  public testLogin(): void {
    this.loader.show();

    this.auth.login(this.formData.practice, this.formData.user, this.formData.password).then(() => {
      this.loader.hide();

      this.formData = {
        practice: "",
        user: null,
        password: ""
      };
    }, (error: string) => {
      this.loader.hide();

      this.formData.password = "";
    });
  }
}
