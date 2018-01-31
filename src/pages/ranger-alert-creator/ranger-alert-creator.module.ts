import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RangerAlertCreatorPage} from './ranger-alert-creator';

@NgModule({
    declarations: [
        RangerAlertCreatorPage,
    ],
    imports: [
        IonicPageModule.forChild(RangerAlertCreatorPage),
    ],
})
export class RangerAlertCreatorPageModule {
}
