import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider, Ranger} from "../../providers/database/database";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

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
                private alertError: AlertErrorProvider) {
    }

    create() {
        let self = this;
        self.disableButton = true;
        self.ranger.username = self.ranger.username.toLowerCase();
        self.db.addUser(self.ranger).then((success) => {
            if (success) {
                self.alertCtrl.create({
                    title: 'Creation Successful',
                    message: `A confirmation email has been sent to ${self.ranger.email} which will expire in` +
                    ` ${DatabaseProvider.NEW_RANGER_EXPIRATION_IN_MINUTES} minutes.`,
                    buttons: ['Ok']
                }).present();
            }
        }).catch((msg) => {
            self.disableButton = false;
            console.log(msg);
            self.alertError.show(msg);
        });
    }
}
