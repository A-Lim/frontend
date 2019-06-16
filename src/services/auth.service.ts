import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './../models/auth-data.model';
import { Subject } from 'rxjs';

import { AlertService } from './alert.service';
import { API_BASE_URL, API_VERSION } from './../config'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${API_BASE_URL}/api/${API_VERSION}/auth`;
  private userId;
  private token;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  checkIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http.post(`${this.url}/register` , authData)
    .subscribe(response => {
      // console.log(response);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{token: string, expiresIn: number, userId: string }>(`${this.url}/login` , authData)
    .subscribe(response => {
      this.token = response.token;
      // if token exists
      if (this.token && response.expiresIn) {
        // set timer to log user out after token expires
        this.setAuthTimer(response.expiresIn);
        // calculate expiration date time
        const now = new Date();
        const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);

        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['dashboard']);
      }
    }, error => {
      this.authStatusListener.next(false);
      this.alertService.error(error.error.message);
    });
  }

  // authenticate user if token is found in localstorage
  autoAuthUser() {
    const authData = this.getLocalAuthData();
    // if no data in localstorage, exit function
    if (!authData)
    return;

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authData.token;
      this.isAuthenticated = true;
      this.userId = authData.userId;
      // divide by 1000 cause expiresIn is in seconds and setTimer accepts milliseconds
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // save token and expiration to local storage
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  // clear local storage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getLocalAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (token && expirationDate) {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
      }
    }
  }
}
