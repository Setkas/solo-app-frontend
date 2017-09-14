import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'teeth-cross-component',
  templateUrl: 'teeth-cross-component.html',
  styleUrls: [
    'teeth-cross-component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class TeethCrossComponent implements OnInit, OnChanges {
  @Input() public interactive: boolean = false;

  @Input() public teeth: boolean = false;

  @Input() private bleeding: boolean = true;

  @Input() private teethData: string[] = [];

  @Input() private selectNext: boolean = false;

  @Output() public $teethSelected: EventEmitter<number> = new EventEmitter();

  public upperJaw: number[] = TeethCrossComponent.GenerateArray(0, 1, 16);

  public lowerJaw: number[] = TeethCrossComponent.GenerateArray(31, -1, 15);

  public selectedTeeth: number = null;

  constructor() {

  }

  ngOnInit() {
    if (this.interactive === true) {
      this.selectedTeeth = this.upperJaw[0];

      this.$teethSelected.emit(this.selectedTeeth);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectNext'] && changes['selectNext'].currentValue === true) {
      setTimeout(() => {
        this.selectTeeth();
      }, 0);
    }
  }

  private static GenerateArray(from: number, increment: number, limit: number): number[] {
    let array = [];

    if (increment > 0) {
      for (let i = from; i < limit; i = i + increment) {
        array.push(i);
      }
    } else {
      for (let i = from; i > limit; i = i + increment) {
        array.push(i);
      }
    }

    return array;
  }

  public selectTeeth(index: number = null): void {
    if (this.interactive !== true) {
      return;
    }

    if (index === null) {
      if (this.selectedTeeth < this.lowerJaw[0]) {
        this.selectedTeeth++;

        this.$teethSelected.emit(this.selectedTeeth);
      } else {
        this.selectedTeeth = 0;

        this.$teethSelected.emit(this.selectedTeeth);
      }
    } else {
      this.selectedTeeth = index;

      this.$teethSelected.emit(this.selectedTeeth);
    }
  }

  public setIconClass(index: number): string {
    if (this.teethData.length <= index) {
      return;
    }

    let ret: string = "";

    switch (this.teethData[index]) {
      case "0":
        ret = "none";

        break;

      case "K":
        ret = "sa-tooth-crown";

        break;

      case "I":
        ret = "sa-tooth-implant";

        break;

      case "L":
        ret = "sa-tooth-gap";

        break;

      case "Y":
        ret = "sa-tooth-baby";

        break;

      case "M":
        ret = "sa-tooth-bridge-left";

        break;

      case "D":
        ret = "sa-tooth-bridge-right";

        break;
    }

    return ret;
  }

  public setHideText(index: number): boolean {
    if (this.teethData.length <= index) {
      return;
    }

    let ret: boolean = false;

    switch (this.teethData[index]) {
      case "0":
        ret = true;

        break;
    }

    return ret;
  }
}
