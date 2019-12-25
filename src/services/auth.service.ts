import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from 'models/auth-data.model';
import { User } from 'models/user.model';
import { LoginReponse } from 'models/responses/loginresponse.model';
import { RegistrationResponse } from 'models/responses/registrationresponse.model';
import { Subject, Observable } from 'rxjs';

import { BaseService } from 'services/base.service';
import { AlertService } from 'services/alert.service';
import { API_BASE_URL, API_VERSION } from 'config';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  private url = `${API_BASE_URL}/api/${API_VERSION}/auth`;
  private user: User;
  private token;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<{isAuthenticated: boolean, user: User}>();

  constructor(private http: HttpClient, private router: Router, alertService: AlertService) {
    super(alertService);
  }

  getToken(): string {
    return this.token;
  }

  checkIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserData(): User {
    return this.user;
  }

  getAuthStatusListener(): Observable<{isAuthenticated: boolean, user: User}> {
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post<LoginReponse>(`${this.url}/login` , authData)
      .pipe(
        map(response => {
          this.token = response.token;
          // if token exists
          if (this.token && response.expiresIn) {
            // set timer to log user out after token expires
            this.setAuthTimer(response.expiresIn);
            // calculate expiration date time
            const now = new Date();
            const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);

            this.isAuthenticated = true;
            this.user = response.user;
            this.authStatusListener.next({ isAuthenticated: this.isAuthenticated, user: this.user });
            this.saveAuthData(this.token, expirationDate, this.user);
            this.router.navigate(['admin/dashboard']);
          }
          return response;
        })
      );
  }

  register(email: string, password: string, confirmPassword: string) {
    const data = { email, password, confirmPassword };
    return this.http.post<RegistrationResponse>(`${this.url}/register` , data)
      .pipe(
        map(response => {
          if (response.logsUserIn && response.token && response.expiresIn) {
            this.token = response.token;
            // set timer to log user out after token expires
            this.setAuthTimer(response.expiresIn);
            // calculate expiration date time
            const now = new Date();
            const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
            this.isAuthenticated = true;
            this.user = response.user;

            this.authStatusListener.next({ isAuthenticated: this.isAuthenticated, user: this.user });
            this.saveAuthData(this.token, expirationDate, this.user);
            this.router.navigate(['admin/dashboard']);
            return response;
          }
        })
      );
  }

  getProfile() {
    return this.http.get<User>(`${this.url}/profile`);
  }

  updateProfile(data: any) {
    return this.http.patch<{message: string, user: User}>(`${this.url}/profile` , data)
      .pipe(
        map(response => {
          this.alertSuccess(response.message);
          this.user = response.user;
          // update local storage data
          localStorage.setItem('user', JSON.stringify(this.user));
          this.authStatusListener.next({ isAuthenticated: true, user: this.user });
          return response;
        })
      );
  }

  // authenticate user if token is found in localstorage
  autoAuthUser(): void {
    const authData = this.getLocalAuthData();
    // if no data in localstorage, exit function
    if (!authData) {
      return;
    }

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authData.token;
      this.isAuthenticated = true;
      this.user = authData.user;
      // divide by 1000 cause expiresIn is in seconds and setTimer accepts milliseconds
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next({
        isAuthenticated: this.isAuthenticated,
        user: authData.user,
      });
    }
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next({ isAuthenticated: false, user: null });
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.user = null;
    this.router.navigate(['login']);
    this.alertSuccess('Successfully logged out');
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // save token and expiration to local storage
  private saveAuthData(token: string, expirationDate: Date, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  // clear local storage
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private getLocalAuthData(): { token: string, expirationDate: Date, user: User } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && expirationDate) {
      return {
        token,
        expirationDate: new Date(expirationDate),
        user
      };
    }
  }
}
