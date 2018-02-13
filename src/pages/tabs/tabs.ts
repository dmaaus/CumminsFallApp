import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {SettingsPage} from "../settings/settings";
import {RangerHomePage} from "../ranger-home/ranger-home";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = RangerHomePage;
    tab2Root = AboutPage;
    tab3Root = SettingsPage;

    constructor() {

    }
}
