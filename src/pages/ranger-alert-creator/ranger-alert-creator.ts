import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  closePark() {
    // TODO send a push notification to all users saying the park is closed.
  }

}
