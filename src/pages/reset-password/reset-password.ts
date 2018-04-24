import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

    oldPassword: string = '';
    newPassword: string = '';
    newPassword2: string = '';

    errorMessage: string = '';

    pageWhenDone: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider, private alertCtrl: AlertController, private loading: LoadingProvider) {
        this.pageWhenDone = navParams.get('pageWhenDone');
    }

    reset() {
        if (this.newPassword !== this.newPassword2) {
            this.showError('Passwords do not match');
            return;
        }
        let self = this;
        self.loading.present();
        this.auth.resetPassword(this.oldPassword, this.newPassword).then(() => {
            self.loading.dismiss();
            self.showError('');
            self.alertCtrl.create({
                title: 'Password Reset',
                message: 'Your password has successfully been reset.',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        if (self.pageWhenDone !== undefined) {
                            self.navCtrl.push(self.pageWhenDone).then(() => {
                                self.navCtrl.remove(self.navCtrl.length() - 2);
                            });
                        }
                        else {
                            self.navCtrl.pop();
                        }
                        self.showError('');
                    }
                }],
                enableBackdropDismiss: false
            }).present();
        }).catch(self.error());
    }

    error() {
        return this.showError.bind(this);
    }

    showError(msg) {
        this.loading.dismiss();
        this.errorMessage = msg;
    }

}
