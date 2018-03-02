import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

/*
Example of event object
{
            "Account": "Cummins Falls State Park",
            "Title": "2018 Cummins Falls Marathon",
            "EventURL": "2018-cummins-falls-marathon",
            "Summary": "Join us for the 2018 Cummins Falls Marathon, Half Marathon, 10K, and 5K! ",
            "StartDate": 1519452000000,
            "EndDate": 1519452000000,
            "Time": "8:00AM - Marathon/Half Start",
            "Duration": [],
            "Audience": [],
            "Interests": [],
            "Majors": [
                {
                    "name": "Run Club",
                    "url": "run-club",
                    "key": 369
                },
                {
                    "name": "Organized Races",
                    "url": "organized-races",
                    "key": 377
                }
            ],
            "StateParks": [],
            "Recurring": "false",
            "Region": "middle",
            "Status": "Active",
            "Calendar": "",
            "Available": "Yes"
        }

*/

//This module will host all functions that pulls events from
//the TN State park website.
//This module will also use caching to minimize requests to the
//web for a list of events
const STORAGE_KEY = 'cumminsFallsEvents';
const EVENTURL = 'https://tsp.itinio.com/events/events.html';

@Injectable()
export class CumminsFallsEventsProvider {
    
    constructor(public http: HttpClient){}

    getEventsFromUrl() : Observable<CumminsFallsHttpEvent> {
        return this.http.get<CumminsFallsHttpEvent>(EVENTURL, {responseType: 'json'});
    }
    
}

    export class CumminsFallsHttpEvent {
        Events: CumminsFallsEvent[];
    }

    export class CumminsFallsEvent {
        Account: string;
        Title: string;
        EventUrl: string;
        Summary: string;
        StartDate: number;
        EndDate: number;
        Time: string;
        Duration: any;
        Audience: any;
        Interests: any;
        Majors: any;
        StateParks: any;
        Recurring: boolean;
        Region: string;
        Status: string;
        Calendar: string;
        Available: string;
    }