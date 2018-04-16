import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, Platform} from 'ionic-angular';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {Storage} from '@ionic/storage'
import {Closing} from "../../pages/schedule-closing/schedule-closing";
import {OneSignal} from "@ionic-native/onesignal";

@Injectable()
export class NotificationProvider {

    // area
    static readonly WITHIN_50_MILES: string = 'Within_50_Miles_Of_Park';
    static readonly WITHIN_10_MILES: string = 'Within_10_Miles_Of_Park';
    static readonly LOCAL: string = NotificationProvider.WITHIN_10_MILES;
    static readonly WITHIN_5_MILES: string = 'Within_5_Miles_Of_Park';
    static readonly WITHIN_PARK: string = 'Within_Park';
    static readonly ALL: string = 'All';

    // kind
    static readonly PARK_CLOSING: string = 'Opt_Out_Of_Park_Closings';
    static readonly FLOOD_WARNING: string = 'Opt_Out_Of_Flood_Warnings';
    static readonly OTHER: string = 'Opt_Out_Of_Other';

    private static readonly LOCATION_KNOWN: string = 'Location_Allowed';
    private static readonly TIMES_CONSIDERED_ASKING_FOR_LOCATION: string = 'times_asked_for_location';

   public static appId: string = '44279501-70f1-4ee1-90a8-d98ef73f3ce1';
    apiKey: string = '';
    public static googleProjectNumber: string = '386934932788';

    constructor(public http: HttpClient,
                private  alertCtrl: AlertController,
                private permissions: AndroidPermissions,
                private platform: Platform,
                private storage: Storage,
                private oneSignal: OneSignal) {
        this.oneSignal.startInit(
            NotificationProvider.appId,
            NotificationProvider.googleProjectNumber)
            .handleNotificationReceived(jsonData => {
                let data = jsonData['payload']['additionalData'];
                let closing = Closing.fromObject(data);
                Closing.cacheClosing(closing);
            })
            .endInit();
    }

    /**
     * @param  notification
      the notification
      to be sentout. If notification is null,
     *  the extraParams will  be used as a silent notification.
     * @param {Object} extraParams parameters that will be passed directly to the API call
     */
    post(notification: Notification, extraParams: Object = {}): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.apiKey === '') {
                reject('apiKey has not been set, so how was post called?');
                return;}
            let silent = notification === null;
            if (silent) {
                notification = new Notification('', '', '', NotificationProvider.ALL);
            }
            let body = {
                app_id: NotificationProvider.appId,
                contents: {'en': notification.message},
                headings: {'en': notification.title},
                included_segments: [notification.area],
                excluded_segments: [notification.kind]
            };

            if (silent) {
                delete body['excluded_segments'];
                body['content_available'] = true;
                let contentAvailable = {'content_available': true};
                if (extraParams['data'] === undefined) {
                    extraParams['data'] = contentAvailable;
                }
                else {
                    Object.assign(extraParams['data'], contentAvailable);
                }
            }Object.assign(body, extraParams);

            let headers = new HttpHeaders()
                .append('Content-Type', 'application/json; charset=utf-8')
                .append('Authorization', 'Basic ' + this.apiKey);

            let self = this;
            if (notification.area === NotificationProvider.ALL) {
                self._post(body, headers).then(() => {
                    resolve(true);
                }).catch(reject);
            }
            else {
                self._post(body, headers).then(() => {
                    body.included_segments = [NotificationProvider.ALL];
                    body['excluded_segments'] = body['excluded_segments'].concat([NotificationProvider.LOCATION_KNOWN]);
                    self._post(body, headers).then(() => {
                        resolve(true);
                    }).catch((error) => {
                        reject(
                            'The message was successfully sent to some, but not all, recipients. ' +
                            'You can send the notification again, but some people will get it twice. ' +
                            'The following error was produced: '
                            + error);
                    });
                }).catch(reject);
            }
        });
    }

    _post(body, headers: HttpHeaders): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let url = 'https://onesignal.com:443/api/v1/notifications';
            this.http.post(
                url, body, {headers: headers})
                .subscribe(() => {
                    resolve(true);
                }, (error: HttpErrorResponse) => {
                    let message = 'Unknown error. Are you connected to the internet?';
                    console.log('error',error);
                    if (typeof error.error.errors[0] === 'string') {
                        message = error.error.errors[0];
                    }
                    reject(message);
                });
        });
    }

    _shouldRequestLocation(): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.storage.get(NotificationProvider.TIMES_CONSIDERED_ASKING_FOR_LOCATION).then((value) => {
                if (value === null) {
                    self.storage.set(NotificationProvider.TIMES_CONSIDERED_ASKING_FOR_LOCATION, 1).catch(reject);
                    resolve(true);
                }
                else {
                    self.storage.set(NotificationProvider.TIMES_CONSIDERED_ASKING_FOR_LOCATION, value + 1).catch(reject);
                    resolve(false);
                }
            }).catch(reject);
        });
    }


    requestLocation() {
        let self = this;this.alertCtrl.create({
                title: 'Location',
                message: 'Cummins Falls sends notifications through this app about park closings and flash floods. We would like permission to access your location so we can avoid sending you these notifications when you are not near the park. ',
                buttons: [{
                    text: 'Sure',
                    handler: () => {
                        self.oneSignal.promptLocation();
                    }
                }, {
                    text: 'No Thanks',
                    role: 'cancel'
                }]
            }
        ).present();
    }

    /**
     * must be called before user can receive location-based notifications.
     */
    promptLocation() {
        let self = this;
        if (self.platform.is('android')) {
            self.permissions.checkPermission(self.permissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                result => {
                    if (!result.hasPermission) {
                        self._shouldRequestLocation().then((should) => {
                            if (should) {
                                self.requestLocation();
                            }
                        }).catch(console.error);
                    }
                },
                err => {
                    console.error(err.message);
                }
            )
        }
        else {
            self.requestLocation();
        }
    }

    locationAllowed(): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            if (self.platform.is('android')) {
                self.permissions.checkPermission(self.permissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                    result => {
                        resolve(result.hasPermission);
                    }).catch(reject);
            }
            else {
                // TODO find out for iOS as well.
                return true;
            }
        });
    }
}
export class Notification {
    static readonly DEFAULT_KIND: string = 'Other';
    static readonly DEFAULT_AREA: string = 'Everyone';
    static readonly humanReadableKinds: Object = {
        'Park Closing': NotificationProvider.PARK_CLOSING,
        'Flood Warning': NotificationProvider.FLOOD_WARNING,
        'Other': NotificationProvider.OTHER
    };
    static readonly humanReadableAreas: Object = {
        '50 miles': NotificationProvider.WITHIN_50_MILES,
        '10 miles': NotificationProvider.WITHIN_10_MILES,
        '5 miles': NotificationProvider.WITHIN_5_MILES,
        'Within the park': NotificationProvider.WITHIN_PARK,
        'Everyone': NotificationProvider.ALL,
    };

    constructor(public title: string,
                public message: string,
                public kind: string,
                public area: string) {
    }

    fromHumanReadable(kind: string, area: string) {
        this.kind = Notification.humanReadableKinds[kind];
        this.area = Notification.humanReadableAreas[area];
    }
}