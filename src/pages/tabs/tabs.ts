import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {SettingsPage} from "../settings/settings";
import {MapsPage} from '../maps/maps';
import {RangerAlertCreatorPage} from "../ranger-alert-creator/ranger-alert-creator";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    // tab1Root = HomePage;
    tab1Root = RangerAlertCreatorPage;
    tab2Root = AboutPage;
    tab3Root = SettingsPage;
    tab4Root = MapsPage;

    constructor() {

    }
}
