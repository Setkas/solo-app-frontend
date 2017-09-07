import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NgForm} from "@angular/forms";
import {LoaderProvider} from "../../components/loader-component/loader-provider";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthProvider} from "../../providers/auth-provider";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {Variables} from "../../app/variables";

declare const window: Window;

export interface ForgotFormDataInterface {
  practice: string,
  user: number
}

export interface NewPasswordFromDataInterface {
  token: string,
  password: string,
  password_repeat: string
}

@Component({
  selector: 'forgot-page',
  templateUrl: 'forgot-page.html',
  styleUrls: [
    'forgot-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPage implements OnInit, OnDestroy {
  public formData: ForgotFormDataInterface = {
    practice: "",
    user: null
  };

  public newPasswordFormData: NewPasswordFromDataInterface = {
    token: null,
    password: "",
    password_repeat: ""
  };

  constructor(private translate: TranslateService,
              private loader: LoaderProvider,
              private auth: AuthProvider,
              private router: Router,
              private flash: FlashProvider,
              private route: ActivatedRoute) {
    this.route.fragment.subscribe((fragment: string = null) => {
      if (fragment !== null && fragment.indexOf("=") >= 0) {
        let split: string[] = fragment.split("=", 2);

        if (split.length === 2 && split[0].toLowerCase() === "token") {
          this.newPasswordFormData.token = JSON.parse(JSON.stringify(decodeURIComponent(split[1])));
        }

        window.location.hash = "";
      }
    });
  }

  ngOnInit() {
    this.formData = {
      practice: "",
      user: null
    };

    if (this.newPasswordFormData.token === null) {
      this.newPasswordFormData = {
        token: null,
        password: "",
        password_repeat: ""
      };
    }
  }

  ngOnDestroy() {
    this.formData = {
      practice: "",
      user: null
    };

    this.newPasswordFormData = {
      token: null,
      password: "",
      password_repeat: ""
    };
  }

  public resetPassword(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.loader.show();

    this.auth.forgotPassword(this.formData.practice, this.formData.user).then(() => {
      this.loader.hide();

      this.formData = {
        practice: "",
        user: null
      };

      this.flash.show({
        content: this.translate.instant("forgot.PASSWORD_RESET_SUCCESS"),
        type: "success"
      });

      this.router.navigate(["/login"]);
    }, (error: string) => {
      this.loader.hide();

      this.flash.show({
        content: this.translate.instant("error." + error),
        type: "danger"
      });
    });
  }

  public passwordValid(password: string): boolean {
    return Variables.passwordRegex.test(password);
  }

  public newPassword(form: NgForm): void {
    if (!form.valid || this.newPasswordFormData.password !== this.newPasswordFormData.password_repeat) {
      return;
    }

    this.loader.show();

    this.auth.newPassword(this.newPasswordFormData.token, this.newPasswordFormData.password).then(() => {
      this.loader.hide();

      this.newPasswordFormData = {
        token: null,
        password: "",
        password_repeat: ""
      };

      this.flash.show({
        content: this.translate.instant("forgot.NEW_PASSWORD_SUCCESS"),
        type: "success"
      });

      this.newPasswordFormData.token = null;

      this.router.navigate(["/login"]);
    }, (error: string) => {
      this.loader.hide();

      this.flash.show({
        content: this.translate.instant("error." + error),
        type: "danger"
      });
    });
  }
}
