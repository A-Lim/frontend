import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { App } from 'config';
import { BaseComponent } from 'app/components/shared/base.component';
import { TemplateRendererComponent } from 'helpers/template-renderer.component';
import { UserGroupService } from 'services/usergroup.service';
import { AlertService } from 'services/alert.service';


@Component({
  selector: 'app-list-usergroups',
  templateUrl: './list-usergroups.component.html',
  styleUrls: ['./list-usergroups.component.scss']
})
export class ListUsergroupsComponent extends BaseComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('actionsCell') actionsCell: TemplateRef<any>;

  public columnDefs: any[];
  public rowData: any;

  public gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true
    },
    floatingFilter: true,
    animateRows: true,
    pagination: true,
    rowModelType: 'infinite',
    rowHeight: 30,
    cacheBlockSize: 10,
    paginationPageSize: 10
  };

  public dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridOptions.api.showLoadingOverlay();
      this.userGroupService.getUserGroups(params).subscribe(data => {
        this.gridOptions.api.hideOverlay();
        params.successCallback(
          data.doc, data.total
        );
      });
    }
  };

  constructor(private titleService: Title, private userGroupService: UserGroupService,
              alertService: AlertService) {
    super(alertService);
    this.titleService.setTitle(`${App.NAME} | User Groups`);
  }

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: '#',
        lockPosition: true,
        valueGetter: 'node.rowIndex + 1',
        cellClass: 'locked-col',
        width: 50,
        suppressNavigable: true,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Name',
        field: 'name',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Code',
        field: 'code',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Users Count',
        field: 'users',
        sortable: false,
        filter: false,
        width: 80,
        valueGetter(params) {
          // checks if null, cause cell might be rendered before data has loaded
          return params.data ? params.data.users.length : 0;
        }
      },
      {
        headerName: 'Permissions Count',
        field: 'permissions',
        sortable: false,
        filter: false,
        width: 100,
        valueGetter(params) {
          return params.data ? params.data.permissions.length : 0;
        }
      },
      {
        headerName: 'Action',
        field: '',
        sortable: false,
        filter: false,
        width: 80,
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionsCell
        }
      },
    ];
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    params.api.setDatasource(this.dataSource);
  }
}
