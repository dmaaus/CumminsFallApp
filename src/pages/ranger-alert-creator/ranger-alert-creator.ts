import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";
import * as dateformat from 'dateformat';

/**
 * Generated class for the RangerAlertCreatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ranger-alert-creator',
  templateUrl: 'ranger-alert-creator.html',
})
export class RangerAlertCreatorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private notification: NotificationProvider) {
  }

  closePark() {
    let date = dateformat(Date.now(), 'mmm dS');
    this.notification.post('Park Closing', `Cummins Falls is closed for the remainder of today, ${date}`);
  }

}
