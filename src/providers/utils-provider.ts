import {Injectable} from "@angular/core";

@Injectable()
export class UtilsProvider {
  constructor() {
  }

  public static CountBob(teeth: string[], bleeding: boolean[]): [number, number] {
    let result: [number, number] = [
      0,
      0
    ];

    for (let i = 0; i < teeth.length; i++) {
      let id: number = i - 1;

      if (i < 7 || (i > 15 && i < 24)) {
        id = i;
      }

      if (id != 7 && id !== 24 && ["L", "0"].indexOf(teeth[i]) < 0 && ["0"].indexOf(teeth[id]) < 0) {
        result[0]++;

        if (bleeding[id] === true) {
          result[1]++;
        }
      }
    }

    return result;
  }
}
