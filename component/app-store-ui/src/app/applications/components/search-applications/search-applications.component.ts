import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.data.models';
import { Store } from '@ngrx/store';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Application, GetApplicationsParam } from '../../applications.data.models';
import * as applicationsActions from '../../applications.actions';
import * as authActions from '../../../authentication/authentication.actions'
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';

//Breadcrumbs
import * as globalActions from "../../../app.actions";
import { BreadcrumbItem } from "../../../app.data.models";
import { Title } from '@angular/platform-browser';
import { ClientRegParam } from '../../../authentication/authentication.models';
import { ConfirmDialogComponent } from '../../../commons/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'store-search-applications',
  templateUrl: './search-applications.component.html',
  styleUrls: ['./search-applications.component.scss']
})
export class SearchApplicationsComponent implements OnInit {
  dataSource = new MatTableDataSource<Application>();
  searchQuery: string = '';
  public clientData: ClientRegParam;
  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  appResult;

  constructor(private store: Store<AppState>, private router: Router, private titleService: Title, private actions$: Actions, private dialog: MatDialog) { }

  ngOnInit() {
    this.clientData = new ClientRegParam();

    this.store.select((s) => s.authentication.tokenDetails).subscribe((auth) => {
      if (auth) {
        this.store.dispatch(applicationsActions.GetAllApplicationsAction({ "payload": new GetApplicationsParam(0, 10, 0, '') }))
      }
    })

    this.actions$.pipe(ofType(applicationsActions.GetAllApplicationsSuccessAction)).subscribe(p => {
      if (p) {
        this.store
          .select(s => s.applications.allApplications)
          .subscribe(apps => {
            this.dataSource.data = apps.list;
            this.appResult = apps;
          });
      }
    })

    this.store.dispatch(globalActions.SetBreadcrumbAction({ payload: [new BreadcrumbItem("Applications")] }));
    this.titleService.setTitle("Apps | Apigate API Store");
  }

  onAppAction(app, action) {
    switch (action) {

      case 'view': {
        console.log(action);
        this.router.navigate([`applications/${app.applicationId}/overview`]);
        break;
      }

      case 'edit': {
        this.router.navigate([`/applications/create/${app.applicationId}`]);
        break;
      }

      default:
        break;
    }
  }

  openDialog(app, event: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(applicationsActions.DeleteApplicationsAction({ "appId": app.applicationId }))

        this.actions$.pipe(ofType(applicationsActions.DeleteApplicationSuccessAction)).subscribe(p => {
          this.store.dispatch(applicationsActions.GetAllApplicationsAction({ "payload": new GetApplicationsParam(0, 10, 0, '') }))
        })
      }
    });
  }

  onSearchClick() {
    this.store.dispatch(applicationsActions.GetAllApplicationsAction({ "payload": new GetApplicationsParam(0, this.pageSize, 0, this.searchQuery) }))
  }

  onPageChanged(e) {
  }

  paginate(direction) {
    if (direction == 'next') this.pageIndex++;
    if (direction == 'prev') this.pageIndex--;
    let offset = this.pageSize * this.pageIndex;
    this.store.dispatch(applicationsActions.GetAllApplicationsAction({ "payload": new GetApplicationsParam(this.pageIndex, this.pageSize, offset, this.searchQuery) }))
  }
}