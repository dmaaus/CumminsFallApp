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

    loading: boolean = false;
    text: string;
    timer: any;

    constructor(private http: HttpClient, private alertError: AlertErrorProvider) {
        this.text = HoursMessageComponent.GETTING_CLOSINGS;
        this.getClosingsAndCalculateTimes();
        this.timer = setInterval(() => {
            this.calculateText();
        }, 10000);

        document.addEventListener('resume', this.refresh.bind(this), false);
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

    static calculateNextClosing(closings: Closing[]) {
        let now = moment();
        let nextClosing = this.defaultClosingTime();
        closings.some(closing => {
            if (closing.start < nextClosing) {
                while (closing.end > nextClosing) {
                    nextClosing.day(nextClosing.day() + 1);
                }
            }
            if (closing.start >= now) {
                if (closing.start >= nextClosing) {
                    return true;
                }
                else if (closing.start.hours() >= 8) {
                    nextClosing = closing.start;
                    return true;
                }
                else {
                    while (closing.end > nextClosing) {
                        nextClosing.day(nextClosing.day() + 1);
                    }
                }
            }
            return false;
        });
        this.closingTime = nextClosing;
    }

    static calculateNextOpening(closings: Closing[]) {
        let nextOpening = this.defaultOpeningTime();
        closings.some(closing => {
            if (closing.start < nextOpening && closing.end > nextOpening) {
                nextOpening = closing.end;
                return true;
            }
            return false;
        });
        this.openingTime = nextOpening;
    }

    static calculateTimes(closings: Closing[] = null) {
        if (closings === null) {
            closings = this.cachedClosings;
        }
        this.calculateNextClosing(closings);
        this.calculateNextOpening(closings);
    }

    refresh() {
        this.getClosingsAndCalculateTimes(false);
    }

    getClosingsAndCalculateTimes(useCached: boolean = true) {
        let self = this;
        if (useCached && HoursMessageComponent.cachedClosings !== null) {
            HoursMessageComponent.calculateTimes();
            return;
        }
        self.loading = true;
        Closing.getClosings(self.http).then((closings: Closing[]) => {
            HoursMessageComponent.cachedClosings = closings;
            HoursMessageComponent.calculateTimes(closings);
            self.calculateText();
            self.loading = false;
        }).catch(error => {
            self.alertError.show(error);
            self.loading = false;
        });
    }

    /*
    check for closings whenever
    ✓ onResume
    - onRefresh

    update according to closings whenever
    - notificationOpened

    update normally
    ✓ every 10 seconds
     */

    static timeTillMessage(time: moment.Moment) {
        let now = moment();
        if (time.isSame(now, 'day')) {
            let hours = time.diff(now, 'hours');
            let minutes = time.diff(now, 'minutes') % 60;
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
                this.getClosingsAndCalculateTimes();
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
