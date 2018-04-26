import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {SettingsPage} from "../settings/settings";
import {MapsPage} from '../maps/maps';
import {HomePage} from "../home/home";

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',


})
export class TabsPage {

    tab1Root = HomePage;
    tab2Root = AboutPage;
    tab3Root = SettingsPage;
    tab4Root = MapsPage;

    constructor() {

    }
}
