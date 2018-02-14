import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RangerAlertCreatorPage} from "../ranger-alert-creator/ranger-alert-creator";
import {ManageRangerPage} from "../manage-ranger/manage-ranger";
import {AuthProvider} from "../../providers/auth/auth";
import {DatabaseProvider} from "../../providers/database/database";
import {ResetPasswordPage} from "../reset-password/reset-password";

@IonicPage()
@Component({
    selector: 'page-ranger-home',
    templateUrl: 'ranger-home.html',
})
export class RangerHomePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider, private db: DatabaseProvider) {
    }

    goToCreateAlert() {
        this.navCtrl.push(RangerAlertCreatorPage);
    }

    goToManageRangers() {
        this.navCtrl.push(ManageRangerPage);
    }

    isAdmin() {
        return this.auth.loggedInRanger ? this.auth.loggedInRanger.isAdmin : false;
    }

    resetPassword() {
        this.navCtrl.push(ResetPasswordPage);
    }

    logout() {
        this.navCtrl.pop();
        this.auth.logout();
    }
}
