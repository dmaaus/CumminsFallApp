import {Component} from '@angular/core';
import {Closing} from "../../pages/schedule-closing/schedule-closing";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

@Component({
    selector: 'hours-message',
    templateUrl: 'hours-message.html'
})
export class HoursMessageComponent {

    static closingTime: moment.Moment = HoursMessageComponent.defaultClosingTime();
    static openingTime: moment.Moment = HoursMessageComponent.defaultOpeningTime();

    static cachedClosings: Closing[] = null;

    static GETTING_CLOSINGS = 'Retrieving park closures...';

    loading: any = null;
    text: string;
    timer: any;

    constructor(private http: HttpClient, private alertError: AlertErrorProvider) {
        this.text = HoursMessageComponent.GETTING_CLOSINGS;
        this.getClosingsAndCalculateHours();
        this.timer = setInterval(() => {
            this.calculateText();
        }, 30000);
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }


    // today at 8 is default opening time.
    static defaultOpeningTime(): moment.Moment {
        let result = moment('8', 'hh');
        if (result < moment()) {
            result.day(result.day() + 1);
        }
        return result
    }

    // today at 6 is default closing time.
    static defaultClosingTime(): moment.Moment {
        let result = moment('18', 'hh');
        if (result < moment()) {
            result.day(result.day() + 1);
        }
        return result
    }


    static calculateHours(closings: Closing[] = null) {
        if (closings === null) {
            closings = this.cachedClosings;
        }
        if (closings.length === 0) {
            this.openingTime = this.defaultOpeningTime();
            this.closingTime = this.defaultClosingTime();
            return;
        }
        let now = moment();
        let start = closings[0].start;
        if (start < now) {
            // park is currently closed
            // the end of this closing will be when they open, unless it is the end of the day
            if (!start.untilClosing) {

            }
        }
        let daysTillNextClose = start.diff(now, 'days', true);
        if (daysTillNextClose >= 2) {
            this.openingTime = this.defaultOpeningTime();
        }
        if (start.day() == now.day()) {
            // the closing is for today

        }
    }

    getClosingsAndCalculateHours(useCached: boolean = true) {
        let self = this;
        if (useCached && HoursMessageComponent.cachedClosings !== null) {
            HoursMessageComponent.calculateHours();
        }
        self.loading.show();
        Closing.getClosings(self.http).then((closings: Closing[]) => {
            HoursMessageComponent.cachedClosings = closings;
            HoursMessageComponent.calculateHours(closings);
            self.loading.hide();
        }).catch(error => {
            self.alertError.show(error);
            self.loading.hide();
        });
    }

    /*
    check for closings whenever
    onResume
    onRefresh

    update according to closings whenever
    checked
    notificationOpened

    update normally
    every 30 seconds
     */

    static timeTillMessage(time: moment.Moment) {
        let now = moment();
        if (time.day() === now.day()) {
            let hours = time.diff(now, 'hours');
            let minutes = time.diff(now, 'minutes');
            let hourPart = `${hours} hours and`;
            if (hours === 0) {
                hourPart = ' ';
            }
            return `at ${time.format('h:mm')} (in ${hourPart} ${minutes} minutes)`;
        }
        else {
            let day = now.calendar(time, {
                sameDay: '[today]',
                nextDay: '[tomorrow]',
                nextWeek: 'dddd, M/D/YY',
                lastDay: '[yesterday]',
                lastWeek: '[last] dddd',
                sameElse: 'dddd, M/D/YY'
            });
            return `${day} at ${time.format('h:mm a')}`;
        }
    }

    calculateText() {
        let openingTime = HoursMessageComponent.openingTime;
        let closingTime = HoursMessageComponent.closingTime;
        let now = moment();

        if (closingTime < now || openingTime < now) {
            if (this.text !== HoursMessageComponent.GETTING_CLOSINGS) {
                this.getClosingsAndCalculateHours();
                this.text = HoursMessageComponent.GETTING_CLOSINGS;
            }
            return;
        }
        if (closingTime < openingTime) {
            this.text = `The park closes ${HoursMessageComponent.timeTillMessage(closingTime)}`;
        }
        else {
            this.text = `The park is closed and will open again ${HoursMessageComponent.timeTillMessage(openingTime)}`;
        }
    }
}
