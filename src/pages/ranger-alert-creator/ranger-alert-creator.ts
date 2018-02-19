import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationProvider} from "../../providers/notification/notification";
import * as dateformat from 'dateformat';

@IonicPage()
@Component({
    selector: 'page-ranger-alert-creator',
    templateUrl: 'ranger-alert-creator.html',
})
export class RangerAlertCreatorPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private notification: NotificationProvider) {
    }

    closePark() {
        // TODO notification only sends to people in the area
        let date = dateformat(Date.now(), 'mmm dS');
        this.notification.postToLocal('Park Closing', `Cummins Falls is closed for the remainder of today, ${date}`);
    }

}
