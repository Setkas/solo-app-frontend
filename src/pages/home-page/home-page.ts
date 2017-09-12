import {Component, ViewEncapsulation} from '@angular/core';
import {Variables} from "../../app/variables";
import {PracticeProvider, UserProvider} from "../../providers";

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: [
    'home-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  public helpMail: string = Variables.helpEmail;

  constructor(public practice: PracticeProvider,
              public user: UserProvider) {
  }
}
