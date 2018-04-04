import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ViewClosingsPage} from "../view-closings/view-closings";

import {ContactPage} from './contact-page/contact-page';
import {HistoryPage} from './history-page/history-page';
import {TrailsInfoPage} from './trails-info-page/trails-info-page';
@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {
    contactPage = ContactPage;
    historyPage = HistoryPage;
    trailsInfoPage = TrailsInfoPage;
    constructor(public navCtrl: NavController) {}
    goToClosings() {
        this.navCtrl.push(ViewClosingsPage);
    }
}
