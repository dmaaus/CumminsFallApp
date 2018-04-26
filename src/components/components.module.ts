import {NgModule} from '@angular/core';
import {EventCardComponent} from './event-card/event-card';
import {IonicModule} from 'ionic-angular';
import {CommonModule} from '@angular/common';
import {HoursMessageComponent} from './hours-message/hours-message';
import {PlacePicCardComponent} from './place-pic-card/place-pic-card';
import {WeatherCardComponent} from './weather-card/weather-card';
import {VisitorStatisticsComponent} from './visitor-statistics/visitor-statistics';

@NgModule({
    declarations: [EventCardComponent,
        HoursMessageComponent,
        PlacePicCardComponent,
        WeatherCardComponent,
    VisitorStatisticsComponent],
    imports: [IonicModule, CommonModule],
    exports: [EventCardComponent,
        HoursMessageComponent,
        PlacePicCardComponent,
        WeatherCardComponent,
    VisitorStatisticsComponent]
})
export class ComponentsModule {
}
