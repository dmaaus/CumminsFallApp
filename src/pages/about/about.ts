import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ViewClosingsPage} from "../view-closings/view-closings";

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    constructor(public navCtrl: NavController) {

    }

    goToClosings() {
        this.navCtrl.push(ViewClosingsPage);
    }

}
