import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider, Ranger} from "../../providers/database/database";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage()
@Component({
    selector: 'page-ranger-info',
    templateUrl: 'ranger-info.html',
})
export class RangerInfoPage {

    ranger: Ranger = Ranger.NULL_RANGER;

    lookingAtOwnInfo() {
        return this.ranger.equals(this.auth.loggedInRanger);
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertCtrl: AlertController, private alertError: AlertErrorProvider, private auth: AuthProvider) {
        let self = this;
        db.getRangerWithName(navParams.get('ranger')).then(ranger => {
            self.ranger = ranger;
            console.log('got ranger: ' + self.ranger.toString());
        });
    }

    deleteRanger() {
        let self = this;
        self.alertCtrl.create({
            title: 'Confirm Deletion',
            message: `This will revoke all privileges from ${self.ranger.name}. Are you sure you want to continue?`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    self.db.deleteUser(self.ranger.username).then(() => {
                        self.alertCtrl.create({
                            title: 'Deletion Complete',
                            message: `${self.ranger.name} was successfully deleted.`,
                            buttons: ['Ok']
                        }).present();
                    }).catch(self.alertError.showCallback())
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
