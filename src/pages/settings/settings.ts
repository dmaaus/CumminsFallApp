import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RangerLoginPage} from "../ranger-login/ranger-login";
import {NotificationSettingsPage} from "../notification-settings/notification-settings";
import {AuthProvider} from "../../providers/auth/auth";
import {RangerHomePage} from "../ranger-home/ranger-home";
import {CreateRangerPage} from "../create-ranger/create-ranger";

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    constructor(public navCtrl: NavController, private auth: AuthProvider) {

    }

    goToRangerLogin() {
        this.navCtrl.push(this.auth.loggedIn() ? RangerHomePage : RangerLoginPage);
    }

    goToNotificationSettings() {
        this.navCtrl.push(NotificationSettingsPage);
    }

    createRanger() {
        this.navCtrl.push(CreateRangerPage);
    }
}
