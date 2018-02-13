import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {RangerInfoPage} from "../ranger-info/ranger-info";
import {CreateRangerPage} from "../create-ranger/create-ranger";

/**
 * Generated class for the ManageRangerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-manage-ranger',
    templateUrl: 'manage-ranger.html',
})
export class ManageRangerPage {
    rangers: string[];

    // TODO cannot delete self.

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider) {
        this.rangers = db.getRangerNames();
    }

    selectRanger(ranger: string) {
        this.navCtrl.push(RangerInfoPage, {ranger: ranger})
    }

    addRanger() {
        this.navCtrl.push(CreateRangerPage);
    }
}
