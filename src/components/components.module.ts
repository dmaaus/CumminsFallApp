import {NgModule} from '@angular/core';
import {EventCardComponent} from './event-card/event-card';
import {IonicModule} from 'ionic-angular';
import {CommonModule} from '@angular/common';
import {HoursMessageComponent} from './hours-message/hours-message';
import { PlacePicCardComponent } from './place-pic-card/place-pic-card';

@NgModule({
    declarations: [EventCardComponent,
        HoursMessageComponent,
    PlacePicCardComponent],
    imports: [IonicModule, CommonModule],
    exports: [EventCardComponent,
        HoursMessageComponent,
    PlacePicCardComponent]
})
export class ComponentsModule {
}
