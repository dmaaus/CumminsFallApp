import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ViewClosingsPage} from './view-closings';

@NgModule({
    declarations: [
        ViewClosingsPage,
    ],
    imports: [
        IonicPageModule.forChild(ViewClosingsPage),
    ],
})
export class ViewClosingsPageModule {
}
