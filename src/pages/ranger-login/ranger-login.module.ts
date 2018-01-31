import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RangerLoginPage} from './ranger-login';

@NgModule({
    declarations: [
        RangerLoginPage,
    ],
    imports: [
        IonicPageModule.forChild(RangerLoginPage),
    ],
})
export class RangerLoginPageModule {
}
