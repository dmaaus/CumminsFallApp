import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider, Ranger} from "../../providers/database/database";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

/**
 * Generated class for the RangerInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-ranger-info',
    templateUrl: 'ranger-info.html',
})
export class RangerInfoPage {

    ranger: Ranger;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertCtrl: AlertController, private alertError: AlertErrorProvider) {
        this.ranger = db.getRangerWithName(navParams.get('ranger'));
    }

    deleteRanger() {
        this.alertCtrl.create({
            title: 'Confirm Deletion',
            message: `This will revoke all privileges from ${this.ranger.name}. Are you sure you want to continue?`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.db.deleteUser(this.ranger.username).then(() => {
                        this.alertCtrl.create({
                            title: 'Deletion Complete',
                            message: `${this.ranger.name} was successfully deleted.`,
                            buttons: ['Ok']
                        }).present();
                    }).catch(this.alertError.show)
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }]
        }).present();
    }

    revokeAdmin() {
        // TODO
    }

    grantAdmin() {
        // TODO
    }
}
