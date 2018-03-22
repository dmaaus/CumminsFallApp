import { Component,ViewChild } from '@angular/core';

import { CumminsFallsEventsProvider, CumminsFallsHttpEvent, CumminsFallsEvent } from '../../providers/events/events';

import { Slides, NavController } from 'ionic-angular';
import { EventPage } from '../../pages/event/event';

/**
 * Generated class for the EventCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-card',
  templateUrl: 'event-card.html'
})
export class EventCardComponent {

  httpEvent : CumminsFallsHttpEvent;
  
  eventPage : EventPage;

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
        let newDisplayEvent = new DisplayEvent();
        newDisplayEvent.title = event.Title;
        newDisplayEvent.summary = event.Summary;
        newDisplayEvent.date = new Date(event.StartDate);

        console.log(`${this.cumminsFallsDisplayEvents.push(newDisplayEvent)} event(s) added.`);
      })
      this.cardSlides.update();
    });
  }

  loadEventPage(){
    //Get current slide index
    let slideIndex = this.cardSlides.getActiveIndex();

    //grab event from list
    let clickedEvent = this.cumminsFallsEvents[slideIndex];

    this.navCntrl.push(EventPage, {clickedEvent});
  }
}

class DisplayEvent {
  title: String;
  date: Date;
  summary: String;
}