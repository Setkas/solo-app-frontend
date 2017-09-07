import {Component, ViewEncapsulation} from '@angular/core';
import {AuthProvider, ClientProvider} from "../../providers";
import {Router} from "@angular/router";

@Component({
  selector: 'menu-component',
  templateUrl: 'menu-component.html',
  styleUrls: ['menu-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent {
  public clientMenu: boolean = false;

  constructor(private auth: AuthProvider,
              private client: ClientProvider,
              private router: Router) {
    this.client.$onSelected.subscribe(() => {
      this.clientMenu = true;
    });

    this.client.$onDeSelected.subscribe(() => {
      this.clientMenu = false;
    });
  }

  public logout(): void {
    this.auth.logout();

    this.router.navigate(["/login"]);
  }
}
