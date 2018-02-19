import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
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


@Injectable()
export class CumminsFallsEvents {
    constructor(public storage: Storage){}

    
}