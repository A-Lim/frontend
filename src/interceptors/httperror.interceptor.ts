import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
 } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AlertService } from 'services/alert.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) { }

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(req)
     .pipe(
       catchError((error: HttpErrorResponse) => {
          if (error.error && error.error.message) {
            this.alertService.error(error.error.message);
          } else {
            this.alertService.error('Oops, unable to process request currently');
          }
          return throwError(error);
       })
     );
 }
}
