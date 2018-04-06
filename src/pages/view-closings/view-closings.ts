import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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

    /**
     * in constructor, you register with Closing
     * in ngOnDestroy, you unregister with Closing
     * whenever you receive a notification, Closing is called to add the closing to its list
     * whenever you resume the app, Closing is called to add the closing to its list
     * whenever Closing updates its list, it calls everyone who is registered with it to update their stuff.
     */

    getClosings() {
        let self = this;
        self.loading.present(true, true);
        Closing.getClosings(this.http).then(closings => {
            self.closings = closings;
            self.loading.dismiss();
        }).catch(self.alertError.showCallback(self.loading));
    }
}
