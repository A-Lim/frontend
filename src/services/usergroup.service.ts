import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from 'services/base.service';
import { AlertService } from 'services/alert.service';
import { UserGroup } from 'models/usergroup.model';
import { API_BASE_URL, API_VERSION } from 'config';
import { IGetRowsParams } from 'ag-grid-community';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserGroupService extends BaseService {
  private url = `${API_BASE_URL}/api/${API_VERSION}/usergroups`;

  constructor(private http: HttpClient, alertService: AlertService) {
    super(alertService);
  }

  getUserGroups(params: IGetRowsParams = null) {
    const qParams = this.encodeParams(params);
    return this.http.get<{ doc: [UserGroup], total: number }>(`${this.url}`, { params: qParams });
  }

  getUserGroup(id: string) {
    return this.http.get<UserGroup>(`${this.url}/${id}`);
  }

  createUserGroup(data: any) {
    return this.http.post<{status: boolean, message: string}>(`${this.url}` , data);
  }
}
