import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import {GoogleMapsPage} from './google-maps-page/google-maps-page';
import {TrailsPage} from './trails-page/trails-page';

@Component({
    templateUrl: 'maps.html'
})
export class MapsPage {
    googleMapsPage = GoogleMapsPage;
    trailPage = TrailsPage;

    constructor(navCtrl: NavController) {
    }
}