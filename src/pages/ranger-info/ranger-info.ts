import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {EmailProvider} from "../../providers/email/email";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private email: EmailProvider) {
    }

    sendEmail() {
        this.email.send('mailgun@example.com', 'jonmcclung@gmail.com', 'Test Message', 'Hey, you got my test message! Hope that wasn\'t too difficult!').then(() => {
            console.log('success!');
        }).catch(console.error);
    }

}
