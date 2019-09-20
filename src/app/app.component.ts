import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  public title = 'globalfamilysurvey';
  public isAuthenticated = false;
  public user: object;
  private authListenerSubscriber: Subscription;

  constructor(private authService: AuthService, public router: Router) {
  }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe(data => {
        this.isAuthenticated = data.isAuthenticated;
        this.user = data.user;
      });
  }

  ngOnDestroy() {
    this.authListenerSubscriber.unsubscribe();
  }
}
