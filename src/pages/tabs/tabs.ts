import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {SettingsPage} from "../settings/settings";
import {RangerInfoPage} from "../ranger-info/ranger-info";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = RangerInfoPage;
    tab2Root = AboutPage;
    tab3Root = SettingsPage;

    constructor() {

    }
}
