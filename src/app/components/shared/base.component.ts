import { AfterViewInit } from '@angular/core';
import { AlertService } from 'services/alert.service';
import { Alert, AlertType } from 'models/alert.model';

export abstract class BaseComponent implements AfterViewInit {

  constructor(private alertService: AlertService) { }

  ngAfterViewInit() {
    // check if history has alert data
    if (history.state.data && history.state.data.alert) {
      const alert: Alert = history.state.alert;
      // show alert based on type
      switch (alert.type) {
        case AlertType.success:
          this.alertService.success(alert.message);
          break;

        case AlertType.error:
          this.alertService.error(alert.message);
          break;

        default:
          break;
      }
    }
  }
}
