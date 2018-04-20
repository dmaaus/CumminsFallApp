import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification, NotificationProvider} from "../../providers/notification/notification";
import {LoadingProvider} from "../../providers/loading/loading";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {Closing, ScheduleClosingPage} from "../schedule-closing/schedule-closing";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";
import {DatabaseProvider} from "../../providers/database/database";
import {MakeNotificationPage} from "../make-notification/make-notification";

@IonicPage()
@Component({
    selector: 'page-ranger-alert-creator',
    templateUrl: 'ranger-alert-creator.html',
})
export class RangerAlertCreatorPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private notificationProvider: NotificationProvider,
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
        this.alertCtrl.create()
            .setTitle('Area Closed')
            .addInput({
                type: 'radio',
                label: Closing.JUST_GORGE,
                value: Closing.JUST_GORGE,
                checked: true
            })
            .addInput({
                type: 'radio',
                label: Closing.WHOLE_PARK,
                value: Closing.WHOLE_PARK
            })
            .addButton({
                text: 'Ok',
                handler: area => {
                    ScheduleClosingPage.scheduleClosing(
                        new Closing(
                            moment(),
                            moment(),
                            true,
                            false,
                            true,
                            area),
                        this.alertError,
                        this.sendClosingNotification.bind(this),
                        this.navCtrl,
                        this.loading,
                        this.http,
                        this.db);
                }
            })
            .addButton({
                text: 'Cancel',
                role: 'cancel'
            })
            .present();
    }

    floodWarning() {
        this.sendNotification(
            new Notification(
                'Flood Warning',
                'Cummins Falls is or may soon be experiencing flash flooding. ' +
                'Please exit the park immediately.',
                NotificationProvider.FLOOD_WARNING,
                NotificationProvider.WITHIN_PARK));
    }

    sendNotification(notification: Notification,
                     extraParams: Object = {},
                     confirmationTitle: string = '',
                     confirmationMessage: string = '') {
        let self = this;
        self.loading.present();
        self.notificationProvider.post(notification, extraParams)
            .then(self.displayConfirmation.bind(self, confirmationTitle, confirmationMessage))
            .catch(self.alertError.showCallback(this.loading));
    }

    sendNotificationWithSilentData(notification: Notification,
                                   audibleData: Object = {},
                                   silentData: Object = {},
                                   confirmationTitle: string = '',
                                   confirmationMessage: string = '') {
        let self = this;
        self.loading.present();
        self.notificationProvider.post(null, silentData)
            .then(() => {
                self.notificationProvider.post(notification, audibleData)
                    .then(self.displayConfirmation.bind(self, confirmationTitle, confirmationMessage))
                    .catch(self.alertError.showCallback(self.loading));
            })
            .catch(self.alertError.showCallback(self.loading));
    }

    sendClosingNotification(sendTime: moment.Moment, message: string, closing: Closing) {
        let silentData = {
            data: closing.toObject()
        };
        let visibleData = {};
        let confirmationTitle = '';
        let confirmationMessage = '';
        if (sendTime.valueOf() !== 0) {
            visibleData['send_after'] = sendTime.toString();
            confirmationTitle = 'Notification Scheduled';
            confirmationMessage =
                'The notification has been scheduled to be sent out closer to the time of the actual closing.'
        }

        this.sendNotificationWithSilentData(
            new Notification(
                'Park Closing',
                message,
                NotificationProvider.PARK_CLOSING,
                NotificationProvider.LOCAL),
            visibleData,
            silentData,
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

    compose() {
        let self = this;
        self.navCtrl.push(MakeNotificationPage, {
            'callback': this.sendNotification.bind(this)
        });
    }
}
