import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";
import {LoadingProvider} from "../../providers/loading/loading";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {OneSignal} from "@ionic-native/onesignal";

@IonicPage()
@Component({
    selector: 'page-notification-settings',
    templateUrl: 'notification-settings.html',
})
export class NotificationSettingsPage {

    static readonly OPT_OUT_FLOOD_TAG = 'opt_out_of_flood_warnings';
    static readonly OPT_OUT_PARK_TAG = 'opt_out_of_park_closings';
    static readonly OPT_OUT_OTHER = 'opt_out_of_other';
    static id: string = '';
    locationAllowed: boolean = false;
    optInPark: boolean = true;
    optInFlood: boolean = true;
    optInOther: boolean = true;
    timer: any;
    loaded: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private http: HttpClient,
                private notification: NotificationProvider,
                private loading: LoadingProvider,
                private alertError: AlertErrorProvider,
                private oneSignal: OneSignal) {
        this.getTags();
        this.updateLocationAllowed();
    }

    getId(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (NotificationSettingsPage.id !== '') {
                resolve(NotificationSettingsPage.id);
            }
            this.oneSignal.getPermissionSubscriptionState().then(status => {
                NotificationSettingsPage.id = status.subscriptionStatus.userId;
                resolve(NotificationSettingsPage.id);
            }).catch(reject);
        })
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
        let headers = new HttpHeaders().append('Content-Type', 'application/json; charset=utf-8');
        console.log('getting tags');
        self.loading.present();
        this.getId().then(id => {
            this.http.get(
                `https://onesignal.com/api/v1/players/${id}`,
                {headers: headers})
                .subscribe(response => {
                    console.log('response', response);
                    let tags = response['tags'];
                    self.optInPark = !tags.hasOwnProperty(NotificationSettingsPage.OPT_OUT_PARK_TAG);
                    self.optInFlood = !tags.hasOwnProperty(NotificationSettingsPage.OPT_OUT_FLOOD_TAG);
                    self.optInOther = !tags.hasOwnProperty(NotificationSettingsPage.OPT_OUT_OTHER);
                    self.loading.dismiss();
                    console.log('got tags');
                    self.loaded = true;
                }, (error: HttpErrorResponse) => {
                    let message = 'Unknown error. Are you connected to the internet?';
                    console.log('error', error);
                    if (typeof error.error.errors[0] === 'string') {
                        message = error.error.errors[0];
                    }
                    self.loading.dismiss();
                    console.log('error in getting tags');
                    self.alertError.show(message);
                });
        }).catch(self.alertError.showCallback(self.loading));
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    promptLocation() {
        this.notification.requestLocation();
        this.timer = setInterval(() => {
            this.updateLocationAllowed();
        }, 100);
    }

    optFlood() {
        this.opt(NotificationSettingsPage.OPT_OUT_FLOOD_TAG, this.optInFlood);
    }

    optPark() {
        this.opt(NotificationSettingsPage.OPT_OUT_PARK_TAG, this.optInPark);
    }

    optOther() {
        console.log('optInOther', this.optInOther);
        this.opt(NotificationSettingsPage.OPT_OUT_OTHER, this.optInOther);
    }

    /**
     * @param {string} tag one of [OPT_OUT_FLOOD_TAG, OPT_OUT_PARK_TAG, OPT_OUT_OTHER]
     * @param {boolean} inOrOut opts you in to tag if true, otherwise opts you out
     */
    opt(tag: string, inOrOut: boolean) {
        let self = this;
        let headers = new HttpHeaders().append('Content-Type', 'application/json; charset=utf-8');
        let tags = {};
        tags[tag] = (inOrOut ? '' : 'true');
        let body = {
            'app_id': NotificationProvider.appId,
            'tags': tags
        };
        console.log('body', body);
        self.loading.present();
        console.log('opting');
        this.getId().then(id => {
            this.http.put(
                `https://onesignal.com/api/v1/players/${id}`,
                body,
                {headers: headers})
                .subscribe(response => {
                    console.log('response', response);
                    self.loading.dismiss();
                    console.log('opted');
                }, (error: HttpErrorResponse) => {
                    let message = 'Unknown error. Are you connected to the internet?';
                    console.log('error', error);
                    if (typeof error.error.errors[0] === 'string') {
                        message = error.error.errors[0];
                    }
                    self.loading.dismiss();
                    console.log('error in opting');
                    self.alertError.show(message);
                });
        }).catch(error => {
            self.alertError.show(error);
            self.loading.dismiss();
        });
    }
}
