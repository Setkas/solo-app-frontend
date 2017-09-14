import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {ClientProvider} from "../providers/client-provider";

@Injectable()
export class ClientGuard implements CanActivate {

  constructor(private router: Router,
              private client: ClientProvider) {

  }

  canActivate() {
    let result: boolean = true;

    if (this.client.details === null && this.client.getStored() === null) {
      this.router.navigate([
        '/client'
      ]);

      result = false;
    }

    return result;
  }
}
