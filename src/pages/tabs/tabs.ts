import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {SettingsPage} from "../settings/settings";
import {MapsPage} from '../maps/maps';
import {HomePage} from "../home/home";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = AboutPage;
    tab2Root = HomePage;
    tab3Root = SettingsPage;
    tab4Root = MapsPage;

    constructor() {

    }
}
