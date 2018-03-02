/**
 * This provider is focused on obtaining a list of events from the
 * TN State Park events API
 * 
 * The current Events API (Feb. 27th, 2018): https://tsp.itinio.com/events/events.html
 */

 import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs/Observable';

 export module CumminsFallsEventsProvider {
     /** 
      * This class is used to grab the correct events from the
      * State Park API. Deals with parsing all the events given
      * by the API
     */
     export class EventsProvider {

     }
     export class EventsModel {
         public Events : Event[]
     }
     /** 
      * This class descibes the items within an event.
      * Follows the following model:
      * {
            "Account": "Seven Islands State Birding Park",
            "Title": "Birding with Friends",
            "EventURL": "birding-with-friends",
            "Summary": "This event is part of a monthly birding series held on the 4th Wednesday of every month. No RSVP required, and you do not have to be a member of KTOS",
            "StartDate": 1519797600000,
            "EndDate": 1519797600000,
            "Time": "",
            "Duration": [
                {
                    "name": "2 to 4 Hours",
                    "url": "2-to-4-hours",
                    "key": 332
                }
            ],
            "Audience": [
                {
                    "name": "Everyone",
                    "url": "everyone",
                    "key": 351
                }
            ],
            "Interests": [
                {
                    "name": "Hiking / Exploring",
                    "url": "hiking-exploring",
                    "key": 237
                },
                {
                    "name": "Birding / Wildlife",
                    "url": "birding-wildlife",
                    "key": 240
                },
                {
                    "name": "Nature / Science",
                    "url": "nature-science",
                    "key": 243
                }
            ],
            "Majors": [],
            "StateParks": [
                {
                    "name": "Norris Dam State Park",
                    "url": "norris-dam-state-park",
                    "key": 298
                },
                {
                    "name": "Panther Creek State Park",
                    "url": "panther-creek-state-park",
                    "key": 300
                }
            ],
            "Recurring": "false",
            "Region": "east",
            "Status": "Active",
            "Calendar": "",
            "Available": "Yes"
        }
     */
     export class Event {

     }
 }