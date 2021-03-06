import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { AppState } from '../../../app.data.models';
import { Subscription } from "../../applications.data.models";
import { ConfirmDialogComponent } from "../../../commons/components/confirm-dialog/confirm-dialog.component";
import { ApiSearchResult, ApiSummary } from '../../../apis/apis.models';
import { NotificationService } from "../../../shared/services/notification.service";
import * as applicationsActions from '../../applications.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'store-application-subscriptions',
  templateUrl: './application-subscriptions.component.html',
  styleUrls: ['./application-subscriptions.component.scss']
})
export class ApplicationSubscriptionsComponent implements OnInit {

  public datasource: MatTableDataSource<Subscription> = new MatTableDataSource();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private notification: NotificationService,
    private actions$: Actions,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.actions$.pipe(ofType(applicationsActions.GetApplicationSubscriptionsSuccessAction)).subscribe(p => {
      if (p) {
        this.store.select(s => s.applications.appSubscriptions).subscribe(res => (this.datasource.data = res.list));
      }
    });

    this.route.params.subscribe(params => {
      let appId = params['appId'];
      this.store.dispatch(applicationsActions.GetApplicationSubscriptionsAction({ "payload": appId }));
    })
  }

  //subscription
  onAction(sub, action) {
    if (action === "unsubscribe") {
      const ref = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirm Unsubscribe",
          message:
            'Are you sure you want to unsubscribe from "' +
            sub.apiName +
            " - " +
            sub.apiVersion +
            '"?'
        }
      });

      ref.afterClosed().subscribe(res => {
        if (res) {
          this.notification.success("Subscription successfully deleted");
        }
      });
    }
  }

  newSubscription() {
    const addSubs = this.dialog.open(DialogAppAddSubscription, {
      width: '380px'
    });

    addSubs.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'dialog-application-add-subscriptions',
  templateUrl: 'dialog-add-subscription.html'
})
export class DialogAppAddSubscription implements OnInit {
  apis: ApiSummary[];

  constructor(
    private store: Store<AppState>,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.store
      .select(s => s.apis.apiSearchResult)
      .subscribe((res: ApiSearchResult) => {
        this.apis = res.list;
        this.ref.markForCheck();
      });
  }
}