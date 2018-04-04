import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CreateRangerPage} from './create-ranger';

@NgModule({
    declarations: [
        CreateRangerPage,
    ],
    imports: [
        IonicPageModule.forChild(CreateRangerPage),
    ],
})
export class CreateRangerPageModule {
}
