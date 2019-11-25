import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from 'services/base.service';
import { AlertService } from 'services/alert.service';
import { User } from 'models/user.model';
import { API_BASE_URL, API_VERSION } from 'config';
import { IGetRowsParams } from 'ag-grid-community';

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

  encodeParams(params) {
    const qParams: any = {};

    qParams.skip = params.startRow;
    qParams.limit = params.endRow - params.startRow;

    Object.keys(params.filterModel).forEach(keys => {
      const filter = params.filterModel[keys];
      const val = filter.type + ':' + filter.filter;
      qParams[keys] = val;
    });

    const sortData = [];
    params.sortModel.forEach(model => {
      sortData.push(`${model.sort}:${model.colId}`);
    });

    if (sortData.length > 0) {
      qParams.sort = sortData.join(';');
    }

    return qParams;
  }
}
