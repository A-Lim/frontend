import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorComponent } from '../app/components/error/error.component';

import { ModalService, ModalOptions } from '../services/modal.service';
import { ModalComponent } from '../app/components/shared/modal/modal.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private modalService: ModalService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let defaultMessage = 'An unknown error occurred!';
        if (error.error.message) {
          defaultMessage = error.error.message;
        }

        // const modalOptions = new ModalOptions('Modal example title','Modal example body');
        // this.modalService.addModal(ModalComponent, modalOptions);
        // this.dialog.open(ErrorComponent, { data: {message: defaultMessage}});
        return throwError(error);
      })
    );
  }
}
