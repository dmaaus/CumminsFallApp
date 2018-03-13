import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, Platform} from 'ionic-angular';
import {OneSignal} from '@ionic-native/onesignal';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {Storage} from '@ionic/storage'
import {AlertErrorProvider} from "../alert-error/alert-error";

@Injectable()
export class NotificationProvider {

    static readonly WITHIN_50_MILES: string = 'Within_50_Miles_Of_Park';
    static readonly WITHIN_10_MILES: string = 'Within_10_Miles_Of_Park';
    static readonly WITHIN_5_MILES: string = 'Within_5_Miles_Of_Park';
    static readonly WITHIN_PARK: string = 'Within_Park';
    static readonly ALL: string = 'All';

    private static readonly LOCATION_KNOWN: string = 'Location_Allowed';
    private static readonly TIMES_CONSIDERED_ASKING_FOR_LOCATION: string = 'times_asked_for_location';

    appId: string = '44279501-70f1-4ee1-90a8-d98ef73f3ce1';
    apiKey: string = '';
    googleProjectNumber: string = '386934932788';

    constructor(public http: HttpClient, private oneSignal: OneSignal, private alertCtrl: AlertController, private permissions: AndroidPermissions, private platform: Platform, private storage: Storage, private alertError: AlertErrorProvider) {
        this.oneSignal.startInit(
            this.appId,
            this.googleProjectNumber)
            .handleNotificationOpened((jsonData) => {
                // TODO update park closing information on home screen
                console.log('notification opened: ' + JSON.stringify(jsonData));
            })
            .endInit();
    }

    /**
     * @param {string} title The title of the notification
     * @param {string} message The message of the notification
     * @param {string} segment The segment to send it to (one of the static readonly variables of this class). Note that it will also be sent to anyone whose location is unknown.
     * @param {string} confirmationTitle The title used in the confirmation dialog
     * @param {string} confirmationMessage The message used in the confirmation message
     */
    post(title: string, message: string, segment: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.apiKey === '') {
                reject('apiKey has not been set, so how was post called?');
                return;
            }
            let body = {
                app_id: this.appId,
                contents: {'en': message},
                headings: {'en': title},
                included_segments: [segment]
            };

            let headers = new HttpHeaders()
                .append('Content-Type', 'application/json; charset=utf-8')
                .append('Authorization', 'Basic ' + this.apiKey);

            let self = this;
            if (segment === NotificationProvider.ALL) {
                self._post(body, headers).then(() => {
                    resolve(true);
                }).catch(reject);
            }
            else {
                self._post(body, headers).then(() => {
                    body.included_segments = [NotificationProvider.ALL];
                    body['excluded_segments'] = [NotificationProvider.LOCATION_KNOWN];
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

    /**
     * @param title The title of the notification
     * @param message The message of the notification
     * Sends the message to everyone within a certain radius of Cummins Falls, as well as those whose location we don't
     * know.
     */
    postToLocal(title: string, message: string): Promise<boolean> {
        return this.post(title, message, NotificationProvider.WITHIN_10_MILES);
    }

    _post(body, headers: HttpHeaders): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let url = 'https://onesignal.com:443/api/v1/notifications';
            this.http.post(
                url, body, {headers: headers})
                .subscribe(() => {
                    resolve(true);
                }, reject);
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
        this.alertCtrl.create({
                title: 'Location',
                message: 'Cummins Falls sends notifications through this app about park closings and flash floods. We would like permission to access your location so we can avoid sending you these notifications when you are not near the park. We will never store your location or sell your data.',
                buttons: [{
                    text: 'Sure',
                    handler: () => {
                        this.oneSignal.promptLocation();
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
