import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { UserService } from '../../../../services/user.service';
import { IDatasource, IGetRowsParams, GridOptions, GridApi } from 'ag-grid-community';
// import { ActionCellRendererComponent } from '../../cells/action-cell-renderer/action-cell-renderer.component';
import { TemplateRendererComponent } from '../../../../helpers/template-renderer.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})

export class ListUserComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('actionsCell') actionsCell: TemplateRef<any>;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;

  public columnDefs: any[];
  public rowData: any;

  // public gridApi: GridApi;
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
      this.userService.getUsers(params).subscribe(data => {
        this.gridOptions.api.hideOverlay();
        params.successCallback(
          data.doc, data.total
        );
      });
    }
  };

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: '#',
        lockPosition: true,
        valueGetter: 'node.rowIndex + 1',
        cellClass: 'locked-col',
        width: 30,
        suppressNavigable: true,
        sortable: false,
        filter: false
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Email',
        field: 'email',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: true,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        width: 80,
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.statusCell
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
    // this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    params.api.setDatasource(this.dataSource);
  }
}
