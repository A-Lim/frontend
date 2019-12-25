import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlertService } from './alert.service';
import { BaseService } from 'services/base.service';
import { User } from 'models/user.model';
import { API_BASE_URL, API_VERSION } from 'config';
import { IGetRowsParams } from 'ag-grid-community';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  private url = `${API_BASE_URL}/api/${API_VERSION}/users`;

  constructor(private http: HttpClient, alertService: AlertService) {
    super(alertService);
  }

  getUsers(params: IGetRowsParams = null) {
    let qParams = null;
    if (params) {
      qParams = this.encodeParams(params);
    }
    return this.http.get<{ doc: [User], total: number }>(`${this.url}`, { params: qParams });
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  updateUser(id: string, data: any) {
    return this.http.patch<{message: string, user: User}>(`${this.url}/${id}` , data)
      .pipe(
        map(response => {
          this.alertSuccess(response.message);
          return response;
        })
      );
  }

  // updateProfile(data: any) {
  //   return this.http.patch<{message: string, user: User}>(`${this.url}/profile` , data)
  //     .pipe(
  //       map(response => {
  //         this.alertSuccess(response.message);
  //         this.user = response.user;
  //         // update local storage data
  //         localStorage.setItem('user', JSON.stringify(this.user));
  //         this.authStatusListener.next({ isAuthenticated: true, user: this.user });
  //         return response;
  //       })
  //     );
  // }
}
