import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  private authListenerSubscriber: Subscription;
  public isAuthenticated = false;
  public user: User;

  constructor(private authService: AuthService) {
  }

  // if displayname is empty, show email
  // getDisplayName(): string {
  //   // if (this.user !== undefined) {

  //   // }
  //   // return
  //   // return this.user.displayName?.trim() === '' ? this.user.email : this.user.displayName.trim();
  // }

  ngOnInit() {
    // authListenerSubscriber block might not be initialize first cause synchronous code
    // call checkIsAuthenticated first in case subscriber is not called
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.user = this.authService.getUserData();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe(data => {
        this.isAuthenticated = data.isAuthenticated;
        this.user = data.user;
      });
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  ngOnDestroy() {
    this.authListenerSubscriber.unsubscribe();
  }

}
