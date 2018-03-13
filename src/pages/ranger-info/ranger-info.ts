import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider, Ranger} from "../../providers/database/database";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {AuthProvider} from "../../providers/auth/auth";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
    selector: 'page-ranger-info',
    templateUrl: 'ranger-info.html',
})
export class RangerInfoPage {

    ranger: Ranger = Ranger.makeNullRanger();

    lookingAtOwnInfo() {
        return this.ranger.equals(this.auth.loggedInRanger);
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private alertCtrl: AlertController, private alertError: AlertErrorProvider, private auth: AuthProvider, private loading: LoadingProvider) {
        let self = this;
        self.loading.present(true);
        db.getRangerWithName(navParams.get('ranger')).then(ranger => {
            self.ranger = ranger;
            self.loading.dismiss();
        }).catch(self.alertError.showCallback(self.loading));
    }

    deleteRanger() {
        let self = this;
        self.alertCtrl.create({
            title: 'Confirm Deletion',
            message: `${self.ranger.name} will no longer be able to log in to the app or create alerts. ` +
            `Are you sure you want to continue?`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    self.loading.present();
                    self.db.deleteUser(self.ranger).then(() => {
                        self.loading.dismiss();
                        self.alertCtrl.create({
                            title: 'Deletion Complete',
                            message: `${self.ranger.name} was successfully deleted.`,
                            buttons: [{
                                text: 'Ok',
                                handler: () => {
                                    self.navCtrl.pop();
                                }
                            }]
                        }).present();
                    }).catch(self.alertError.showCallback(self.loading))
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }]
        }).present();
    }

    revokeAdmin() {
        let self = this;
        self.loading.present();
        self.db.updateAdminRights(self.ranger, false).then(() => {
            self.loading.dismiss();
            self.alertCtrl.create({
                title: 'Rights Revoked',
                message: `${self.ranger.name} no longer has admin privileges.`,
                buttons: ['Ok']
            }).present();
        }).catch(self.alertError.showCallback(self.loading));
    }

    grantAdmin() {
        let self = this;
        self.loading.present();
        self.db.updateAdminRights(self.ranger, true).then(() => {
            self.loading.dismiss();
            self.alertCtrl.create({
                title: 'Rights Granted',
                message: `${self.ranger.name} now has admin privileges.`,
                buttons: ['Ok']
            }).present();
        }).catch(self.alertError.showCallback(self.loading));
    }

    resendConfirmationCode() {
        let self = this;
        self.loading.present();
        this.db.resendConfirmationCode(this.ranger).then(() => {
            self.loading.dismiss();
            self.alertCtrl.create({
                title: 'Code Sent',
                message: `Another confirmation code has been sent to ${self.ranger.name} at ${self.ranger.email}.`,
                buttons: ['Ok']
            }).present();
        }).catch(self.alertError.showCallback(self.loading));
    }
}
