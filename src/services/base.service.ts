import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'services/alert.service';

export abstract class BaseService {

  constructor(private alertService: AlertService) { }

  alertError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.alertService.error('Oops, unable to process request currently');
    } else {
      this.alertService.error(error.error.message);
    }
  }

  alertSuccess(message: any) {
    this.alertService.success(message);
  }
}
