import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {RangerInfoPage} from "../ranger-info/ranger-info";
import {CreateRangerPage} from "../create-ranger/create-ranger";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
    selector: 'page-manage-ranger',
    templateUrl: 'manage-ranger.html',
})
export class ManageRangerPage {
    rangers: string[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertError: AlertErrorProvider, private loading: LoadingProvider) {
    }

    // noinspection JSUnusedGlobalSymbols
    ionViewWillEnter() {
        let self = this;
        self.loading.present(true, true);
        self.db.getRangerNames().then(names => {
            self.rangers = names;
            self.loading.dismiss();
        }).catch(self.alertError.showCallback(self.loading));
    }

    selectRanger(ranger: string) {
        this.navCtrl.push(RangerInfoPage, {ranger: ranger})
    }

    addRanger() {
        this.navCtrl.push(CreateRangerPage);
    }
}