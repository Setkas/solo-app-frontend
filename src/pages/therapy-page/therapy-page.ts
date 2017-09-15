import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {StixInterface} from "../../providers";
import {ClientProvider} from "../../providers/client-provider";
import {TermProvider} from "../../providers/term-provider";
import {Subscription} from "rxjs/Subscription";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";
import {UtilsProvider} from "../../providers/utils-provider";
import {SetupProvider} from "../../providers/setup-provider";

@Component({
  selector: 'therapy-page',
  templateUrl: 'therapy-page.html',
  styleUrls: [
    'therapy-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class TherapyPage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  public teethData: string[] = [];

  public passData: number[] = [];

  public selectedStix: number = null;

  public stixList: StixInterface[] = UtilsProvider.LoadStixOrder();

  constructor(public client: ClientProvider,
              private term: TermProvider,
              private setup: SetupProvider,
              private flash: FlashProvider,
              private translate: TranslateService) {
    this.subs.push(this.term.$onLoad.subscribe(() => {
      this.loadData();
    }));

    this.subs.push(this.setup.$onLoad.subscribe(() => {
      this.selectedStix = JSON.parse(JSON.stringify(this.setup.current.therapy_color));
    }));
  }

  ngOnInit() {
    if (this.term.activeTerm) {
      this.loadData();
    }

    if(this.setup.current !== null) {
      this.selectedStix = JSON.parse(JSON.stringify(this.setup.current.therapy_color));
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  private loadData(): void {
    this.teethData = this.term.activeTerm.teeth;

    this.passData = this.term.activeTerm.pass;
  }

  public stixSelected(index: number): void {
    if (this.selectedStix === null) {
      return;
    }

    this.term.activeTerm.pass[index] = this.selectedStix;

    this.passData[index] = this.selectedStix;

    this.term.save().then(() => {
      this.loadData();
    }, (err: string) => {
      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }
}
