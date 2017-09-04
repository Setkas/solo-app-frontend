import {Component, ViewEncapsulation, ViewChild, TemplateRef} from '@angular/core';
import {LoggerProvider} from "../../providers/logger-provider";
import {ModalButtonInterface, ModalProvider, ModalEventInterface, ModalEvents} from "./modal-provider";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";

export interface ModalDataInterface {
  title: string,
  content: string,
  buttons: ModalButtonInterface[]
}

@Component({
  selector: 'modal-component',
  templateUrl: 'modal-component.html',
  styleUrls: ['modal-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {
  public modalData: ModalDataInterface = null;

  private modalInstance: NgbModalRef = null;

  @ViewChild('modalContent') private modalContent: TemplateRef<any>;

  constructor(modal: ModalProvider,
              private ngbModal: NgbModal,
              private translate: TranslateService) {
    modal.$events.subscribe((event: ModalEventInterface) => {
      this.eventReaction(event);
    });
  }

  private eventReaction(event: ModalEventInterface): void {
    switch (event.event) {
      case ModalEvents.show:
        this.show(event);

        break;

      case ModalEvents.hide:
        this.hide();

        break;

      default:
        LoggerProvider.Error("[FLASH]: Cannot decode received event.");
    }
  }

  private show(data: ModalEventInterface): boolean {
    if (data) {
      this.modalData = {
        title: data.title,
        content: data.content,
        buttons: data.buttons
      };

      if (data.translate) {
        this.modalData.title = this.translate.instant(this.modalData.title);

        this.modalData.content = this.translate.instant(this.modalData.content);

        this.modalData.buttons.forEach((but: ModalButtonInterface) => {
          but.text = this.translate.instant(but.text);
        });
      }

      this.modalInstance = this.ngbModal.open(this.modalContent, data.options);

      return true;
    } else {
      LoggerProvider.Warning("[MODAL]: Cannot show modal with no data specified.");

      return false;
    }
  }

  private hide(): void {
    this.modalData = null;

    if (this.modalInstance) {
      this.modalInstance.dismiss();

      this.modalInstance = null;
    }
  }

  private click(callback: (NgbModalRef) => void = null): void {
    if (this.modalInstance) {
      if (callback) {
        callback(this.modalInstance);
      } else {
        this.hide();
      }
    }
  }
}
