import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RangerAlertCreatorPage} from "../ranger-alert-creator/ranger-alert-creator";
import {ManageRangerPage} from "../manage-ranger/manage-ranger";
import {AuthProvider} from "../../providers/auth/auth";
import {DatabaseProvider} from "../../providers/database/database";

/**
 * Generated class for the RangerHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-ranger-home',
    templateUrl: 'ranger-home.html',
})
export class RangerHomePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider, private db: DatabaseProvider) {
        console.log(this.db);
    }

    goToCreateAlert() {
        this.navCtrl.push(RangerAlertCreatorPage);
    }

    goToManageRangers() {
        this.navCtrl.push(ManageRangerPage);
    }

    isAdmin() {
        return this.auth.ranger ? this.auth.ranger.isAdmin : false;
    }
}
