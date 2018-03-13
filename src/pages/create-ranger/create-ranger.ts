import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider, Ranger} from "../../providers/database/database";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
    selector: 'page-create-ranger',
    templateUrl: 'create-ranger.html',
})
export class CreateRangerPage {

    ranger: Ranger = Ranger.makeNullRanger();
    disableButton: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private db: DatabaseProvider,
                private alertCtrl: AlertController,
                private alertError: AlertErrorProvider,
                private loading: LoadingProvider) {
    }

    create() {
        let self = this;
        self.disableButton = true;
        self.ranger.username = self.ranger.username.toLowerCase();
        self.loading.present();
        self.db.addUser(self.ranger).then((expiration) => {
                self.loading.dismiss();
                self.alertCtrl.create({
                    title: 'Creation Successful',
                    message: `A confirmation email has been sent to ${self.ranger.email} which will expire at` +
                    ` ${expiration.toLocaleTimeString()}`,
                    buttons: ['Ok']
                }).present();
        }).catch((msg) => {
            self.disableButton = false;
            self.loading.dismiss();
            self.alertError.show(msg);
        });
    }
}
