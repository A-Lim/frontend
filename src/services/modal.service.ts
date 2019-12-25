import { Injectable, ComponentFactoryResolver, Injector, EmbeddedViewRef, ApplicationRef } from '@angular/core';
// import { ModalOptions } from './../models/modal-options';

export class ModalOptions {
  title: string;
  body: string;

  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  componentRef: any = null;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector
              ) { }

  addModal(ModalComponent, modalOptions: ModalOptions) {
    // this.removeModal();

    const factory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    this.componentRef = factory.create(this.injector);

    this.appRef.attachView(this.componentRef.hostView);

    this.componentRef.instance.modalOptions = modalOptions;

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);
  }

  removeModal() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }
  }
}
