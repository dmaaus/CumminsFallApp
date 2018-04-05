import {NgModule} from '@angular/core';
import {EventCardComponent} from './event-card/event-card';
import {IonicModule} from 'ionic-angular';
import {CommonModule} from '@angular/common';
import {HoursMessageComponent} from './hours-message/hours-message';

@NgModule({
    declarations: [EventCardComponent,
    HoursMessageComponent],
    imports: [IonicModule, CommonModule],
    exports: [EventCardComponent,
    HoursMessageComponent]
})
export class ComponentsModule {
}
