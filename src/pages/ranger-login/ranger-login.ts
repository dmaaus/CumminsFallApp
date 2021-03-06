import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {RangerHomePage} from "../ranger-home/ranger-home";
import {ResetPasswordPage} from "../reset-password/reset-password";
import {Ranger} from "../../providers/database/database";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
    selector: 'page-ranger-login',
    templateUrl: 'ranger-login.html',
})
export class RangerLoginPage {

    errorMessage: string = '';
    private username: string = '';
    private password: string = '';

    constructor(public navCtrl: NavController, private auth: AuthProvider, private alertCtrl: AlertController, private loading: LoadingProvider) {
        if (auth.loggedIn()) {
            this.continue();
        }
    }

    login() {
        let self = this;
        self.loading.present();
        this.auth.login(this.username.toLowerCase(), this.password).then((ranger: Ranger) => {
            self.loading.dismiss();
            if (ranger.needsToResetPassword()) {
                self.alertCtrl.create({
                    title: 'Password Reset',
                    message: 'For security purposes, you are required to reset your password at this time.',
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            self.navCtrl.push(ResetPasswordPage, {pageWhenDone: RangerHomePage})
                                .then(() => {
                                    self.navCtrl.remove(self.navCtrl.length() - 2);
                                });
                            self.showError('');
                        }
                    }],
                    enableBackdropDismiss: false
                }).present();
            }
            else {
                self.continue();
            }
        }).catch(self.error());
        this.password = '';  // clear for security
    }

    error() {
        return this.showError.bind(this);
    }

    showError(msg: string) {
        this.loading.dismiss();
        this.errorMessage = msg;
    }

    private continue() {
        this.loading.dismiss();
        this.navCtrl.push(RangerHomePage).then(() => {
            this.navCtrl.remove(this.navCtrl.length() - 2);
        });
        this.showError('');
    }
}
