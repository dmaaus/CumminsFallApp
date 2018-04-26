import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ViewClosingsPage} from "../../view-closings/view-closings";

@Component({
    selector: 'contact-page',
    templateUrl: 'contact-page.html',
})
export class ContactPage {
    constructor(public navCtrl: NavController) {
    }

    goToClosings() {
        this.navCtrl.push(ViewClosingsPage);
    }
}
