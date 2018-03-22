import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";
import {LoadingProvider} from "../../providers/loading/loading";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {Closing, ScheduleClosingPage} from "../schedule-closing/schedule-closing";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";
import {DatabaseProvider} from "../../providers/database/database";

@IonicPage()
@Component({
    selector: 'page-ranger-alert-creator',
    templateUrl: 'ranger-alert-creator.html',
})
export class RangerAlertCreatorPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private notification: NotificationProvider,
                private loading: LoadingProvider,
                private alertError: AlertErrorProvider,
                private alertCtrl: AlertController,
                private http: HttpClient,
                private db: DatabaseProvider) {
    }

    displayConfirmation(title: string = '',
                        message: string = '') {
        let defaultTitle = 'Notification Sent';
        let defaultMessage = 'The notification was successfully sent';
        if (title === '') title = defaultTitle;
        if (message === '') message = defaultMessage;
        this.loading.dismiss();
        this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['Ok']
        }).present();
    }

    closePark() {
        ScheduleClosingPage.scheduleClosing(
            new Closing(
                moment(),
                moment(),
                true,
                false,
                true),
            this.alertError,
            this.sendClosingNotification.bind(this),
            this.navCtrl,
            this.loading,
            this.http,
            this.db);
    }

    floodWarning() {
        this.sendNotification(
            'Flood Warning',
            'Cummins Falls is or may soon be experiencing flash flooding. ' +
            'Please exit the park immediately.',
            NotificationProvider.FLOOD_WARNING,
            NotificationProvider.WITHIN_PARK);
    }

    sendNotification(title: string,
                     message: string,
                     kind: string,
                     area: string,
                     extraParams: Object = {},
                     confirmationTitle: string = '',
                     confirmationMessage: string = '') {
        let self = this;
        self.loading.present();
        self.notification.post(title, message, kind, area, extraParams)
            .then(self.displayConfirmation.bind(self, confirmationTitle, confirmationMessage))
            .catch(self.alertError.showCallback(this.loading));
    }

    sendClosingNotification(sendTime: any, message: string) {
        let extraParams = {};
        let confirmationTitle = '';
        let confirmationMessage = '';
        if (sendTime.valueOf() !== 0) {
            extraParams['send_after'] = sendTime.toString();
            confirmationTitle = 'Notification Scheduled';
            confirmationMessage =
                'The notification has been scheduled to be sent out closer to the time of the actual closing.'
        }

        this.sendNotification(
            'Park Closing',
            message,
            NotificationProvider.PARK_CLOSING,
            NotificationProvider.LOCAL,
            extraParams,
            confirmationTitle,
            confirmationMessage
        );
    }

    scheduleClosing() {
        let self = this;
        self.navCtrl.push(ScheduleClosingPage, {
            'callback': this.sendClosingNotification.bind(this)
        });
    }
}
