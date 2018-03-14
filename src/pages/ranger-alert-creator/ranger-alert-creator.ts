import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";
import * as dateformat from 'dateformat';
import {LoadingProvider} from "../../providers/loading/loading";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

@IonicPage()
@Component({
    selector: 'page-ranger-alert-creator',
    templateUrl: 'ranger-alert-creator.html',
})
export class RangerAlertCreatorPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private notification: NotificationProvider, private loading: LoadingProvider, private alertError: AlertErrorProvider, private alertCtrl: AlertController) {
    }

    displayConfirmation(title: string = 'Notification Sent',
                        message: string = 'The notification was successfully sent') {
        this.loading.dismiss();
        this.alertCtrl.create({
            title: 'Notification Sent',
            message: 'The notification was successfully sent',
            buttons: ['Ok']
        }).present();
    }

    closePark() {
        let self = this;
        let date = dateformat(Date.now(), 'mmm dS');
        self.loading.present();

        self.notification.postToLocal(
            'Park Closing',
            `Cummins Falls is closed for the remainder of today, ${date}`)
            .then(self.displayConfirmation.bind(self))
            .catch(self.alertError.showCallback(this.loading));
    }

    floodWarning() {
        let self = this;
        self.loading.present();
        self.notification.post(
            'Flood Warning',
            'Cummins Falls is or may soon be experiencing flash flooding. Please exit the park immediately.',
            NotificationProvider.WITHIN_PARK
        )
            .then(self.displayConfirmation.bind(self))
            .catch(self.alertError.showCallback(this.loading));
    }
}
