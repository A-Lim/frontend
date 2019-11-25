import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;
  public isAuthenticated = false;
  public user: object;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.user = this.authService.getUserData();
    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(data => {
        this.isAuthenticated = data.isAuthenticated;
        this.user = data.user;
      });
  }


  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
