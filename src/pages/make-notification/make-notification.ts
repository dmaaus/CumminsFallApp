import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification} from "../../providers/notification/notification";

@IonicPage()
@Component({
    selector: 'page-make-notification',
    templateUrl: 'make-notification.html',
})
export class MakeNotificationPage {

    kindOptions: Object = {
        title: 'Kind'
    };
    areaOptions: Object = {
        title: 'Range'
    };
    private notification: Notification = new Notification('', '', '', '');
    private kind: string = '';
    private area: string = '';
    private callback: (notification: Notification) => void;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private alertCtrl: AlertController) {
        this.callback = navParams.get('callback');
        this.kind = Notification.DEFAULT_KIND;
        this.area = Notification.DEFAULT_AREA;
    }

    humanReadableKinds(): string[] {
        return Object.keys(Notification.humanReadableKinds);
    }

    humanReadableAreas(): string[] {
        return Object.keys(Notification.humanReadableAreas);
    }

    details(): string {
        return `<p>Title: ${this.notification.title}</p>` +
            `<p>Message: ${this.notification.message.replace('\n', '<br>')}</p>` +
            `<p>Kind of notification: ${this.kind}</p>` +
            `<p>Recipients: ${this.area}</p>`;
    }

    send() {
        let self = this;
        self.notification.fromHumanReadable(self.kind, self.area);
        self.alertCtrl.create({
            title: 'Confirmation',
            message: '<p>Are you sure you want to send out the following notification?</p>' +
            self.details(),
            buttons: [{
                text: 'Ok',
                handler: () => {
                    self.navCtrl.pop().then(() => {
                        self.callback(self.notification);
                    });
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }]
        }).present();
    }
}
