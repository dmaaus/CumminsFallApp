import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {LoadingProvider} from "../../providers/loading/loading";
import {Closing, ClosingListener} from "../schedule-closing/schedule-closing";

@IonicPage()
@Component({
    selector: 'page-view-closings',
    templateUrl: 'view-closings.html',
})
export class ViewClosingsPage implements ClosingListener {
    closings: Closing[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private http: HttpClient,
                private alertError: AlertErrorProvider,
                private loading: LoadingProvider,
                private detector: ChangeDetectorRef) {
        Closing.register(this);
        this.getClosings();
    }

    ngOnDestroy() {
        Closing.unregister(this);
    }

    newClosings(closings: Closing[]) {
        this.closings = closings;
        this.detector.detectChanges();
    }

    getClosings() {
        let self = this;
        self.loading.present(true, true);
        Closing.getClosings(this.http, true, this).then(closings => {
            self.closings = closings;
            self.loading.dismiss();
        }).catch(self.alertError.showCallback(self.loading));
    }
}
