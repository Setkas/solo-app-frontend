import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Variables} from "../../app/variables";
import {PracticeProvider, UserProvider, StixInterface} from "../../providers";
import {ClientProvider} from "../../providers/client-provider";
import {TermProvider} from "../../providers/term-provider";
import {Subscription} from "rxjs/Subscription";
import {
  BleedChangeInterface,
  TeethBleedingInterface
} from "../../components/teeth-cross-component/teeth-cross-component";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";
import {UtilsProvider} from "../../providers/utils-provider";
import {SetupProvider} from "../../providers/setup-provider";

@Component({
  selector: 'bleed-page',
  templateUrl: 'bleed-page.html',
  styleUrls: [
    'bleed-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class BleedPage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  public teethData: string[] = [];

  public bleedData: TeethBleedingInterface = null;

  public stixData: number[] = [];

  public tartarData: [boolean, boolean] = null;

  public bobData: [number, number] = null;

  public soloBleed: {inner: [number, number], outer: [number, number]} = null;

  public selectedStix: number = null;

  public stixImageSrc: string = Variables.images.stixUrl;

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
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  private loadData(): void {
    this.teethData = this.term.activeTerm.teeth;

    this.bleedData = {
      inner: this.term.activeTerm.bleed_inner,
      outer: this.term.activeTerm.bleed_outer,
      middle: this.term.activeTerm.bleed_middle
    };

    this.stixData = this.term.activeTerm.stix;

    this.tartarData = JSON.parse(JSON.stringify(this.term.activeTerm.tartar));

    this.bobData = UtilsProvider.CountBob(this.teethData, this.bleedData.middle);

    this.soloBleed = {
      inner: this.countSoloBleed("inner"),
      outer: this.countSoloBleed("outer")
    };
  }

  public bleedingChanged(data: BleedChangeInterface): void {
    switch (data.type) {
      case 'middle':
        this.term.activeTerm.bleed_middle[data.index] = data.value;

        break;

      case 'inner':
        this.term.activeTerm.bleed_inner[data.index] = data.value;

        break;

      case 'outer':
        this.term.activeTerm.bleed_outer[data.index] = data.value;

        break;

      default:
        return;
    }

    this.bobData = UtilsProvider.CountBob(this.teethData, this.bleedData.middle);

    this.soloBleed = {
      inner: this.countSoloBleed("inner"),
      outer: this.countSoloBleed("outer")
    };

    this.term.save().then(() => {
      this.loadData();
    }, (err: string) => {
      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }

  public toggleTartar(index: number, value: boolean): void {
    if (index > this.tartarData.length) {
      return;
    }

    this.tartarData[index] = value;

    this.term.activeTerm.tartar[index] = value;

    this.term.save().then(() => {
      this.loadData();
    }, (err: string) => {
      this.flash.show({
        content: this.translate.instant("error." + err),
        type: "danger"
      });
    });
  }

  public setBob(type: string, value: boolean): void {
    switch (type) {
      case "inner":
        this.term.activeTerm.bleed_inner.forEach((bleed: boolean, index: number) => {
          this.term.activeTerm.bleed_inner[index] = value;

          this.bleedData.inner[index] = value;
        });

        this.soloBleed.inner = this.countSoloBleed("inner");

        break;

      case "middle":
        this.term.activeTerm.bleed_middle.forEach((bleed: boolean, index: number) => {
          this.term.activeTerm.bleed_middle[index] = value;

          this.bleedData.middle[index] = value;
        });

        this.bobData = UtilsProvider.CountBob(this.teethData, this.bleedData.middle);

        break;

      case "outer":
        this.term.activeTerm.bleed_outer.forEach((bleed: boolean, index: number) => {
          this.term.activeTerm.bleed_outer[index] = value;

          this.bleedData.outer[index] = value;
        });

        this.soloBleed.outer = this.countSoloBleed("outer");

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

  private countSoloBleed(type: string): [number, number] {
    if (this.term.activeTerm === null) {
      return [0, 0];
    }

    let bleed: number = 0,
      max: number = 0;

    switch (type) {
      case "inner":
        this.term.activeTerm.bleed_inner.forEach((value: boolean, index: number) => {
          if (["L", "0"].indexOf(this.term.activeTerm.teeth[index]) < 0) {
            max++;

            if (value === true) {
              bleed++;
            }
          }
        });

        break;

      case "outer":
        this.term.activeTerm.bleed_outer.forEach((value: boolean, index: number) => {
          if (["L", "0"].indexOf(this.term.activeTerm.teeth[index]) < 0) {
            max++;

            if (value === true) {
              bleed++;
            }
          }
        });

        break;

      default:
        return [0, 0];
    }

    return [max, bleed];
  }

  public isBleed(type: string): boolean {
    if (this.term.activeTerm === null) {
      return false;
    }

    let arr: [number, number] = this.countSoloBleed(type);

    if (arr[0] === 0 && arr[1] === 0) {
      return false;
    }

    return arr[1] === arr[0];
  }

  public stixSelected(index: number): void {
    if (this.selectedStix === null) {
      return;
    }

    this.term.activeTerm.stix[index] = this.selectedStix;

    this.stixData[index] = this.selectedStix;

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
