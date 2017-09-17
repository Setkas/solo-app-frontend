import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ClientProvider} from "../../providers/client-provider";
import {TermDataInterface, TermProvider} from "../../providers/term-provider";
import {Subscription} from "rxjs/Subscription";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";
import {PracticeProvider} from "../../providers/practice-provider";
import * as Moment from "moment";
import {SetupProvider} from "../../providers/setup-provider";

@Component({
  selector: 'notes-page',
  templateUrl: 'notes-page.html',
  styleUrls: [
    'notes-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class NotesPage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  public termData: TermDataInterface = null;

  public termHistory: TermDataInterface[] = [];

  public passImage: string = null;

  constructor(public client: ClientProvider,
              public term: TermProvider,
              public practice: PracticeProvider,
              private setup: SetupProvider,
              private flash: FlashProvider,
              private translate: TranslateService) {
    this.subs.push(this.term.$onLoad.subscribe(() => {
      this.loadData();
    }));
  }

  ngOnInit() {
    if (this.term.activeTerm) {
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  private loadData(): void {
    this.termData = JSON.parse(JSON.stringify(this.term.activeTerm));

    this.termHistory = [];

    this.term.termHistory.forEach((data: TermDataInterface, index: number) => {
      if (this.termHistory.length <= this.setup.current.notes_history && !Moment().isSame(Moment.utc(data.date), "d")) {
        if (data.note !== null && data.note.length > 0) {
          this.termHistory.push(data);
        }
      }
    });
  }

  public saveChanges(type: string): void {
    switch (type) {
      case "note":
        this.term.activeTerm.note = JSON.parse(JSON.stringify(this.termData.note));

        break;

      case "next_date":
        this.term.activeTerm.next_date = JSON.parse(JSON.stringify(this.termData.next_date));

        break;

      default:
        return;
    }

    this.term.save().then(() => {
      this.loadData();
    }, (err: string) => {
      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }

  public isChange(): boolean {
    if (this.client.details === null || this.term.termHistory.length === 0) {
      return false;
    }

    return (this.client.details.changes_reminder === null || Moment(this.client.details.changes_reminder).isBefore(Moment(this.term.termHistory[0].date)));
  }

  public sendChanges(): void {
    //@TODO: Add after service exists

    console.debug("@TODO");
  }

  public showPass(): void {
    this.term.loadPass().then((image: string) => {
      this.passImage = image;
    }, (err: string) => {
      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }
}
