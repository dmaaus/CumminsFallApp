import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RangerInfoPage} from './ranger-info';

@NgModule({
    declarations: [
        RangerInfoPage,
    ],
    imports: [
        IonicPageModule.forChild(RangerInfoPage),
    ],
})
export class RangerInfoPageModule {
}
