import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RangerRegisterPage} from './ranger-register';

@NgModule({
    declarations: [
        RangerRegisterPage,
    ],
    imports: [
        IonicPageModule.forChild(RangerRegisterPage),
    ],
})
export class RangerRegisterPageModule {
}
