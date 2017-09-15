import {Injectable} from "@angular/core";
import {Variables} from "../app/variables";

export interface StixInterface {
  value: number,
  preview: string,
  image: string
}

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
      let index: number = i - 1,
        next: number = (index < 16) ? index - 1 : index + 1;

      if (i > 0 && i < 31 && ["L", "0"].indexOf(teeth[index]) < 0 && ["0"].indexOf(teeth[next]) < 0) {
        result[0]++;

        if (bleeding[index] === true) {
          result[1]++;
        }
      }
    }

    return result;
  }

  public static LoadStixOrder(): StixInterface[] {
    let src: StixInterface[] = Variables.stixList,
      order: number[] = [0, 1, 14, 2, 15, 3, 16, 4, 17, 5, 18, 6, 19, 7, 8, 9, 10, 11, 12],
      dst: StixInterface[] = [];

    while (order.length > 0) {
      let id = order.shift();

      src.forEach((data: StixInterface) => {
        if (data.value === id) {
          dst.push(data);
        }
      });
    }

    return dst;
  }
}
