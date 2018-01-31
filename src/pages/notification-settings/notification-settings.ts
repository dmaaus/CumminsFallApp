import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";

/**
 * Generated class for the NotificationSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-notification-settings',
    templateUrl: 'notification-settings.html',
})
export class NotificationSettingsPage {

    locationAllowed: boolean;
    timer: any;

    allowLocationMessage() {
        if (this.locationAllowed) {
            return 'You are only receiving location-based notifications when near Cummins Falls';
        }
        else {
            return 'Receive location-based notifications only when near Cummins Falls?';
        }
    }
    updateLocationAllowed() {
        let self = this;
        this.notification.locationAllowed().then((allowed) => {
            self.locationAllowed = allowed;
        }).catch((err) => {
            console.error(err);
            self.locationAllowed = false;
        });
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private notification: NotificationProvider) {
        this.updateLocationAllowed();
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    promptLocation() {
        this.notification.requestLocation();
        this.timer = setInterval(() => {
            console.log('checking');
            this.updateLocationAllowed();
        }, 1000);
    }
}
