import {Injectable, EventEmitter} from '@angular/core';
import {NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

export interface ModalButtonInterface {
  text: string,
  className?: string,
  callback?: (NgbModalRef) => void
}

export interface ModalEventInterface {
  event: number,
  title?: string,
  content?: string,
  translate?: boolean,
  buttons?: ModalButtonInterface[]
  options?: NgbModalOptions
}

export const ModalEvents: {[key: string]: number} = {
  show: 1,
  hide: 2
};

@Injectable()
export class ModalProvider {
  public $events: EventEmitter<ModalEventInterface> = new EventEmitter<ModalEventInterface>();

  constructor() {

  }

  public show(modalData: {title?: string, content: string, translate?: boolean, buttons?: ModalButtonInterface[], options?: NgbModalOptions}): void {
    let emitData: ModalEventInterface = {
      event: ModalEvents.show,
      content: modalData.content
    };

    emitData.title = modalData.title || null;

    emitData.translate = modalData.translate || false;

    emitData.buttons = modalData.buttons || [];

    emitData.options = modalData.options || {};

    this.$events.emit(emitData);
  }

  public hide(): void {
    this.$events.emit({
      event: ModalEvents.hide
    });
  }
}
