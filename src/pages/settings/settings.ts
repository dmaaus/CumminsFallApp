import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RangerLoginPage} from "../ranger-login/ranger-login";
import {NotificationSettingsPage} from "../notification-settings/notification-settings";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    constructor(public navCtrl: NavController) {

    }

    goToRangerLogin() {
        this.navCtrl.push(RangerLoginPage)
    }

    goToNotificationSettings() {
        this.navCtrl.push(NotificationSettingsPage);
    }

}
