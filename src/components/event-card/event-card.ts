import { Component,ViewChild } from '@angular/core';

import { CumminsFallsEventsProvider, CumminsFallsHttpEvent, CumminsFallsEvent } from '../../providers/events/events';

import { Observable } from 'rxjs/Observable';
import { List, Slides, NavController } from 'ionic-angular';
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

  cumminsFallsEvents: Array<CumminsFallsEvent>;
  header: string;

  @ViewChild(Slides) cardSlides: Slides;

  constructor(private eventsProvider: CumminsFallsEventsProvider, public navCntrl: NavController) {
    this.cumminsFallsEvents = new Array<CumminsFallsEvent>(0);

    this.header = "Upcoming Events"

    eventsProvider.getEventsFromUrl().subscribe(res => {
      this.cumminsFallsEvents = res.Events.filter(event => event.Account.includes("Cummins Falls"));
      this.cardSlides.update();
    });

    //this.parseEvents();
  }

  parseEvents(){
    console.log("Parsing events ...");
    console.log("Length of events: " + this.httpEvent.Events.length);
    this.cumminsFallsEvents.pop();
    this.httpEvent.Events.forEach(event => {
      if(event.Account.includes("Cummins Falls")){
        //console.log("Found Cummins Falls event ...");
        this.cumminsFallsEvents.push(event);
      }
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
