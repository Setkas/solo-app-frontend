import {Component, ViewEncapsulation, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {AppComponent} from "../../app/app-component";

@Component({
  selector: 'not-found-page',
  templateUrl: 'not-found-page.html',
  styleUrls: [
    'not-found-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class NotFoundPage implements OnInit, OnDestroy {
  private wasShownMenu: boolean = false;

  /**
   * Constructor
   * @param location
   */
  constructor(private location: Location) {
  }

  /**
   * DOM ready event callback
   */
  ngOnInit() {
    this.wasShownMenu = AppComponent.ShowMenu;

    AppComponent.ShowMenu = false;
  }

  /**
   * DOM destroy event callback
   */
  ngOnDestroy() {
    AppComponent.ShowMenu = this.wasShownMenu;
  }

  /**
   * Go back to previous page
   */
  public goBack(): void {
    this.location.back();
  }
}
