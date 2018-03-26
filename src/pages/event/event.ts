import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CumminsFallsEvent} from "../../providers/events/events";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
    selector: 'page-event',
    templateUrl: 'event.html',
})
export class EventPage {
    event: CumminsFallsEvent;

    startDate: Date;
    endDate: Date;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private iab: InAppBrowser) {
        this.event = this.navParams.get('clickedEvent') as CumminsFallsEvent;

        this.startDate = new Date(this.event.StartDate);
        this.endDate = new Date(this.event.EndDate);
    }

    goToPage() {
        console.log("Url to load: " + this.event.EventURL);
        this.iab.create('https://tnstateparks.itinio.com/register/' + this.event.EventURL, '_system', {
            hidden: 'no',
            location: 'yes'
        });
    }
}