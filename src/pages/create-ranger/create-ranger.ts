import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider, Ranger} from "../../providers/database/database";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

/**
 * Generated class for the CreateRangerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-create-ranger',
    templateUrl: 'create-ranger.html',
})
export class CreateRangerPage {

    ranger: Ranger;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertCtrl: AlertController, private alertError: AlertErrorProvider) {
    }

    create() {
        this.db.addUser(this.ranger).then((success) => {
            if (success) {
                this.alertCtrl.create({
                    title: 'Creation Successful',
                    message: `A confirmation email has been sent to ${this.ranger.email} which will expire in ${DatabaseProvider.NEW_RANGER_EXPIRATION_IN_MINUTES} minutes.`,
                    buttons: ['Ok']
                }).present();
            }
        })
            .catch(this.alertError.show);
    }

}
