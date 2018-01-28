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
  errorMessage: string = '';

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
    let self = this;
    this.auth.login(this.username, this.password).then((valid) => {
      if (valid) {
        console.log('valid user');
        self.continue();
      }
      else {
        self.showError('Invalid username or password.');
        console.log('invalid');
      }
    }).catch(self.error());
    this.password = '';  // clear for security
  }

  error() {
    return this.showError.bind(this);
  }

  showError(msg: string) {
    this.errorMessage = msg;
  }

  createAccount() {
    if (this.password.length < 8) {
      this.showError('Password must be at least 8 characters in length');
      return;
    }
    let self = this;
    this.auth.register(this.username, this.password).then((valid) => {
      if (valid) {
        console.log('registered');
        self.alertCtrl.create({
          title: 'Registration',
          message: 'Registration successful. You may now sign in.',
          buttons: ['Ok']
        }).present();
      }
      else {
        // this path will probably not be taken
        self.showError('Unable to create account');
      }
    }).catch(self.error());
  }

}
