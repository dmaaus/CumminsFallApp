import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {RangerInfoPage} from "../ranger-info/ranger-info";
import {CreateRangerPage} from "../create-ranger/create-ranger";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

@IonicPage()
@Component({
    selector: 'page-manage-ranger',
    templateUrl: 'manage-ranger.html',
})
export class ManageRangerPage {
    rangers: string[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertError: AlertErrorProvider) {
    }

    ionViewWillEnter() {
        let self = this;
        self.db.getRangerNames().then(names => {
            self.rangers = names;
        }).catch(self.alertError.showCallback());
    }

    selectRanger(ranger: string) {
        this.navCtrl.push(RangerInfoPage, {ranger: ranger})
    }

    addRanger() {
        this.navCtrl.push(CreateRangerPage);
    }
}
