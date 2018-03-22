import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {HttpClient} from "@angular/common/http";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {LoadingProvider} from "../../providers/loading/loading";
import {Closing} from "../schedule-closing/schedule-closing";

@IonicPage()
@Component({
    selector: 'page-view-closings',
    templateUrl: 'view-closings.html',
})
export class ViewClosingsPage {

    closings: Closing[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private http: HttpClient,
                private alertError: AlertErrorProvider,
                private loading: LoadingProvider) {
        this.getClosings();
    }

    getClosings() {
        let self = this;
        self.loading.present(true, true);
        DatabaseProvider.api(this.http, 'closings', 'get')
            .then((results: Object[]) => {
                self.closings = results.map(closing => {
                    return Closing.fromObject(
                        closing['start'],
                        closing['end'],
                        closing['startsNow'],
                        closing['fromOpening'],
                        closing['untilClosing']
                    );
                });
                console.log('closings', self.closings);
                self.loading.dismiss();
            })
            .catch(self.alertError.showCallback(self.loading));
    }

}
