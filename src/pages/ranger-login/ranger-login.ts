import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {RangerAlertCreatorPage} from "../ranger-alert-creator/ranger-alert-creator";

@IonicPage()
@Component({
  selector: 'page-ranger-login',
  templateUrl: 'ranger-login.html',
})
export class RangerLoginPage {

  private username: string = '';
  private password: string = '';
  errorMessage: string = 'This is an error.';

  constructor(public navCtrl: NavController, private auth: AuthProvider, private alertCtrl: AlertController) {
    console.log(auth);
    if (auth.loggedIn()) {
      this.continue();
    }
  }

  continue() {
    this.navCtrl.push(RangerAlertCreatorPage);
  }

  login() {
    console.log(`login... username: ${this.username}, password: ${this.password}`);
    this.auth.login(this.username, this.password).then((valid) => {
      if (valid) {
        console.log('valid user');
        this.continue();
      }
      else {
        this.showError('Invalid username or password.');
        console.log('invalid');
      }
    }).catch(this.showError);
    this.password = '';  // clear for security
  }

  showError(msg: string) {
    this.errorMessage = msg;
  }

  createAccount() {
    if (this.password.length < 8) {
      this.showError('Password must be at least 8 characters in length');
      return;
    }
    this.auth.register(this.username, this.password).then((valid) => {
      if (valid) {
        console.log('registered');
        this.alertCtrl.create({
          title: 'Registration',
          message: 'Almost done! Please check your email to confirm registration.',
          buttons: ['Ok']
        }).present();
      }
      else {
        // this path will probably not be taken
        this.showError('Unable to create account');
      }
    }).catch(this.showError);
  }

}
