import {NgModule} from '@angular/core';
import {EventCardComponent} from './event-card/event-card';
import {IonicModule} from 'ionic-angular';
import {CommonModule} from '@angular/common';
import {HoursMessageComponent} from './hours-message/hours-message';
import {PlacePicCardComponent} from './place-pic-card/place-pic-card';
import {WeatherCardComponent} from './weather-card/weather-card';

@NgModule({
    declarations: [EventCardComponent,
        HoursMessageComponent,
        PlacePicCardComponent,
        WeatherCardComponent],
    imports: [IonicModule, CommonModule],
    exports: [EventCardComponent,
        HoursMessageComponent,
        PlacePicCardComponent,
        WeatherCardComponent]
})
export class ComponentsModule {
}
