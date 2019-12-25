import { AlertService } from './alert.service';

export abstract class BaseService {

  constructor(private alertService: AlertService) { }

  alertSuccess(message: string, keepAfterNavigationChange = false) {
    this.alertService.success(message, keepAfterNavigationChange);
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
