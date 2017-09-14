import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ClientProvider} from "../../providers/client-provider";
import {TermProvider} from "../../providers/term-provider";
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'teeth-page',
  templateUrl: 'teeth-page.html',
  styleUrls: [
    'teeth-page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class TeethPage implements OnInit {
  public selectedTooth: number = null;

  public selectNext: boolean = false;

  public teethData: string[] = [];

  constructor(public client: ClientProvider,
              private term: TermProvider,
              private flash: FlashProvider,
              private translate: TranslateService) {
    this.term.$onLoad.subscribe(() => {
      this.teethData = this.term.activeTerm.teeth;
    });
  }

  ngOnInit() {
    if (this.term.activeTerm) {
      this.teethData = this.term.activeTerm.teeth;
    }
  }

  public setTooth(to: string) {
    if (this.teethData[this.selectedTooth]) {
      if (this.teethData[this.selectedTooth] !== to) {
        this.teethData[this.selectedTooth] = to;
      }

      this.selectNext = true;

      if (this.term.activeTerm) {
        this.term.activeTerm.teeth = this.teethData;

        this.term.save().catch((err: string) => {
          this.flash.show({
            content: this.translate.instant("error." + err),
            type: "danger"
          });
        });
      }
    }
  }

  public isActive(to: string): boolean {
    return this.teethData[this.selectedTooth] === to;
  }

  public toothSelect(tooth: number): void {
    this.selectedTooth = tooth;

    this.selectNext = false;
  }

  public areEights(): boolean {
    return !(this.teethData[0] === "0" && this.teethData[15] === "0" && this.teethData[16] === "0" && this.teethData[31] === "0");
  }

  public toggleEights(): void {
    if (this.areEights()) {
      this.teethData[0] = "0";

      this.teethData[15] = "0";

      this.teethData[16] = "0";

      this.teethData[31] = "0";
    } else {
      this.teethData[0] = "1";

      this.teethData[15] = "1";

      this.teethData[16] = "1";

      this.teethData[31] = "1";
    }

    if (this.term.activeTerm) {
      this.term.activeTerm.teeth = this.teethData;

      this.term.save().catch((err: string) => {
        this.flash.show({
          content: this.translate.instant("error." + err),
          type: "danger"
        });
      });
    }
  }

  public areBaby(): boolean {
    let baby: boolean = true;

    this.teethData.forEach((tooth: string, key: number) => {
      if ((key < 3 || key > 28 || (key > 12 && key < 19)) && tooth !== "0") {
        baby = false;
      }
    });

    return baby;
  }

  public toggleBaby(): void {
    if (this.areBaby()) {
      this.teethData.forEach((tooth: string, key: number) => {
        if (key < 3 || key > 28 || (key > 12 && key < 19)) {
          this.teethData[key] = "1";
        } else if (tooth === "Y") {
          this.teethData[key] = "1";
        }
      });
    } else {
      this.teethData.forEach((tooth: string, key: number) => {
        if (key < 3 || key > 28 || (key > 12 && key < 19)) {
          this.teethData[key] = "0";
        } else {
          this.teethData[key] = "Y";
        }
      });
    }

    if (this.term.activeTerm) {
      this.term.activeTerm.teeth = this.teethData;

      this.term.save().catch((err: string) => {
        this.flash.show({
          content: this.translate.instant("error." + err),
          type: "danger"
        });
      });
    }
  }
}
