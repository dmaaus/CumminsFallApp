import {NgModule} from '@angular/core';
import {EventCardComponent} from './event-card/event-card';
import {IonicModule} from 'ionic-angular';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [EventCardComponent],
    imports: [IonicModule, CommonModule],
    exports: [EventCardComponent]
})
export class ComponentsModule {
}
