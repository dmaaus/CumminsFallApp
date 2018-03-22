import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";
import {OneSignal} from "@ionic-native/onesignal";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
    selector: 'page-notification-settings',
    templateUrl: 'notification-settings.html',
})
export class NotificationSettingsPage {

    static readonly OPT_OUT_FLOOD_TAG = 'opt_out_of_flood_warnings';
    static readonly OPT_OUT_PARK_TAG = 'opt_out_of_park_closings';
    locationAllowed: boolean;
    optOutPark: boolean = false;
    optOutFlood: boolean = false;
    timer: any;
    loaded: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private notification: NotificationProvider,
                private oneSignal: OneSignal,
                private loading: LoadingProvider) {
        /* Although following the documentation, OneSignal does not seem to respect the tags that are sent through
        the API. Thus, this code is commented until it can be figured out how to make it work. */
        // this.getTags();
        this.updateLocationAllowed();
    }

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

    getTags() {
        let self = this;
        self.loading.present(true, true);
        self.oneSignal.getTags().then((tags: Object) => {
            self.optOutPark = tags.hasOwnProperty(NotificationSettingsPage.OPT_OUT_PARK_TAG);
            self.optOutFlood = tags.hasOwnProperty(NotificationSettingsPage.OPT_OUT_FLOOD_TAG);
            self.loading.dismiss();
            self.loaded = true;
        })
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

    optOutParkNotify() {
        if (this.optOutPark) {
            this.oneSignal.sendTag(NotificationSettingsPage.OPT_OUT_PARK_TAG, 'tag');
        }
        else {
            this.oneSignal.deleteTag(NotificationSettingsPage.OPT_OUT_PARK_TAG);
        }
    }

    optOutFloodNotify() {
        if (this.optOutFlood) {
            this.oneSignal.sendTag(NotificationSettingsPage.OPT_OUT_FLOOD_TAG, 'tag');
        }
        else {
            this.oneSignal.deleteTag(NotificationSettingsPage.OPT_OUT_FLOOD_TAG);
        }
    }
}
