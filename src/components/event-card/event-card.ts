import {Component, ViewChild} from '@angular/core';

import {CumminsFallsEvent, CumminsFallsEventsProvider, CumminsFallsHttpEvent} from '../../providers/events/events';

import {NavController, Slides} from 'ionic-angular';
import {EventPage} from '../../pages/event/event';

@Component({
    selector: 'event-card',
    templateUrl: 'event-card.html'
})
export class EventCardComponent {

    httpEvent: CumminsFallsHttpEvent;

    eventPage: EventPage;

    cumminsFallsDisplayEvents: Array<DisplayEvent>;
    cumminsFallsEvents: Array<CumminsFallsEvent>;
    header: string;

    @ViewChild(Slides) cardSlides: Slides;

    constructor(private eventsProvider: CumminsFallsEventsProvider, public navCntrl: NavController) {
        this.cumminsFallsDisplayEvents = new Array<DisplayEvent>(0);
        this.cumminsFallsEvents = new Array<CumminsFallsEvent>(0);

        this.header = "Upcoming Events";

        eventsProvider.getEventsFromUrl().subscribe(res => {
            let events = res.Events.filter(event => event.Account.includes("Cummins Falls"));
            this.cumminsFallsEvents = events;
            events.forEach(event => {
                let newDisplayEvent = DisplayEvent.fromCumminsFallsEvent(event);
                console.log(`${this.cumminsFallsDisplayEvents.push(newDisplayEvent)} event(s) added.`);
            });
            this.cumminsFallsDisplayEvents.push(new DisplayEvent('Title', new Date(), 'This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. This is a long summary. '));
            this.cardSlides.update();
        });
    }

    loadEventPage() {
        //Get current slide index
        let slideIndex = this.cardSlides.getActiveIndex();

        //grab event from list
        let clickedEvent = this.cumminsFallsEvents[slideIndex];

        this.navCntrl.push(EventPage, {clickedEvent});
    }
}

class DisplayEvent {
    constructor(public title: string, public date: Date, public summary: string) {
    }

    static fromCumminsFallsEvent(event: CumminsFallsEvent) {
        return new DisplayEvent(event.Title, new Date(event.StartDate), event.Summary);
    }
}