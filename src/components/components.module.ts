import {NgModule} from '@angular/core';
import {EventCardComponent} from './event-card/event-card';
import {IonicModule} from 'ionic-angular';
import {CommonModule} from '@angular/common';
import { PlacePicCardComponent } from './place-pic-card/place-pic-card';

@NgModule({
    declarations: [EventCardComponent,
    PlacePicCardComponent],
    imports: [IonicModule, CommonModule],
    exports: [EventCardComponent,
    PlacePicCardComponent]
})
export class ComponentsModule {
}
