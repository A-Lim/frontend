import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  private authListenerSubscriber: Subscription;
  public isAuthenticated = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    // authListenerSubscriber block might not be initialize first cause synchronous code
    // call checkIsAuthenticated first in case subscriber is not called
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    if(confirm("Are you sure you want to logout?")) {
      this.authService.logout();
    }
  }

  ngOnDestroy() {
    this.authListenerSubscriber.unsubscribe();
  }

}
