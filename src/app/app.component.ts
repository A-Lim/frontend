import { Component, OnInit, OnDestroy } from '@angular/core';
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
  public userId: string;
  private authListenerSubscriber: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.userId = this.authService.getUserId();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.authListenerSubscriber.unsubscribe();
  }
}
