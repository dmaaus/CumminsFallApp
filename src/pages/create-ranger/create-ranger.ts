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

    ranger: Ranger = Object.assign({}, Ranger.NULL_RANGER);

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertCtrl: AlertController, private alertError: AlertErrorProvider) {
    }

    create() {
        let self = this;
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
        })
            .catch(self.alertError.showCallback());
    }

}
