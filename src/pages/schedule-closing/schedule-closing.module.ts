import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ScheduleClosingPage} from './schedule-closing';

@NgModule({
    declarations: [
        ScheduleClosingPage,
    ],
    imports: [
        IonicPageModule.forChild(ScheduleClosingPage),
    ],
})
export class ScheduleClosingPageModule {
}
