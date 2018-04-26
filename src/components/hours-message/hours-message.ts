import {Component} from '@angular/core';
import {Closing, ClosingListener} from "../../pages/schedule-closing/schedule-closing";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";

@Component({
    selector: 'hours-message',
    templateUrl: 'hours-message.html'
})
export class HoursMessageComponent implements ClosingListener {

    static gorgeClosingTime: moment.Moment = HoursMessageComponent.normalGorgeClosingTime();
    static gorgeOpeningTime: moment.Moment = HoursMessageComponent.normalGorgeOpeningTime();
    static parkClosingTime: moment.Moment = HoursMessageComponent.normalParkClosingTime();
    static parkOpeningTime: moment.Moment = HoursMessageComponent.normalParkOpeningTime();

    static cachedClosings: Closing[] = null;

    static GETTING_CLOSINGS = 'Retrieving park closures...';

    loading: boolean = false;
    text: string;
    timer: any;

    constructor(private http: HttpClient, private alertError: AlertErrorProvider) {
        this.text = HoursMessageComponent.GETTING_CLOSINGS;
        Closing.register(this);
        this.getClosingsAndCalculateTimes();
        this.timer = setInterval(() => {
            this.calculateText();
        }, 10000);
    }

    // today at 8 is default opening time.
    static normalGorgeOpeningTime(): moment.Moment {
        return this.normalParkOpeningTime();
    }

    // today at 6 is default closing time.
    static normalGorgeClosingTime(): moment.Moment {
        let result = moment('17', 'hh');
        if (result < moment()) {
            this.changeDay(result, 1);
        }
        return result;
    }

    // today at 8 is default opening time.
    static normalParkOpeningTime(): moment.Moment {
        let result = moment('8', 'hh');
        if (result < moment()) {
            this.changeDay(result, 1);
        }
        return result;
    }

    // today at 6 is default closing time.
    static normalParkClosingTime(): moment.Moment {
        let result = moment('18', 'hh');
        if (result < moment()) {
            this.changeDay(result, 1);
        }
        return result;
    }

    static calculateNextGorgeClosing(closings: Closing[]) {
        let now = moment();
        let nextClosing = this.normalGorgeClosingTime();

        closings.some(closing => {
            if (!closing.justGorge()) return false;
            if (closing.start >= now) {
                if (closing.start >= nextClosing) {
                    return true;
                }
                if (closing.start.hours() < 17) {
                    let minTime = moment(closing.start);
                    minTime.hours(8);
                    minTime.minutes(1);
                    minTime.millisecond(minTime.millisecond() - 1);
                    if (closing.start > minTime) {
                        nextClosing = moment(closing.start);
                        return true;
                    }
                }
            }
            while (closing.end >= nextClosing) {
                this.changeDay(nextClosing, 1);
            }
            return false;
        });

        this.gorgeClosingTime = nextClosing;
    }

    static calculateNextClosing(closings: Closing[]) {
        let now = moment();
        let nextClosing = this.normalParkClosingTime();

        closings.some(closing => {
            if (closing.justGorge()) return false;
            if (closing.start >= now) {
                if (closing.start >= nextClosing) {
                    return true;
                }
                if (closing.start.hours() < 18) {
                    let minTime = moment(closing.start);
                    minTime.hours(8);
                    minTime.minutes(1);
                    minTime.millisecond(minTime.millisecond() - 1);
                    if (closing.start > minTime) {
                        nextClosing = moment(closing.start);
                        return true;
                    }
                }
            }
            while (closing.end >= nextClosing) {
                this.changeDay(nextClosing, 1);
            }
            return false;
        });

        this.parkClosingTime = nextClosing;
    }

    static calculateNextGorgeOpening(closings: Closing[]) {
        let now = moment();
        let nextOpening = this.normalGorgeOpeningTime();
        closings.forEach(closing => {
            if (!closing.justGorge()) return;
            if (closing.start <= now && closing.end >= now) {
                nextOpening = now;
            }
            if (closing.start <= nextOpening && closing.end >= nextOpening) {
                nextOpening = moment(closing.end);
                if (nextOpening.hours() < 8) {
                    this.resetToHour(nextOpening, 8);
                }
                else if (nextOpening.hours() > 16) {
                    this.resetToHour(nextOpening, 8);
                    this.changeDay(nextOpening, 1);
                }
            }
        });
        this.gorgeOpeningTime = nextOpening;
    }

    static calculateNextOpening(closings: Closing[]) {
        let now = moment();
        let nextOpening = this.normalParkOpeningTime();
        closings.forEach(closing => {
            if (closing.justGorge()) return;
            if (closing.start <= now && closing.end >= now) {
                nextOpening = now;
            }
            if (closing.start <= nextOpening && closing.end >= nextOpening) {
                nextOpening = moment(closing.end);
                if (nextOpening.hours() < 8) {
                    this.resetToHour(nextOpening, 8);
                }
                else if (nextOpening.hours() > 17) {
                    this.resetToHour(nextOpening, 8);
                    this.changeDay(nextOpening, 1);
                }
            }
        });
        this.parkOpeningTime = nextOpening;
    }

    static changeDay(time: moment.Moment, by: number) {
        time.day(time.day() + by);
    }

    static changeHours(time: moment.Moment, by: number) {
        time.hours(time.hours() + by);
    }

    static resetToHour(time: moment.Moment, hour: number) {
        time.hours(hour);
        time.minutes(0);
        time.seconds(0);
        time.millisecond(0);
    }

    static calculateTimes(closings: Closing[] = null) {
        if (closings === null) {
            closings = this.cachedClosings;
        }
        this.calculateNextGorgeClosing(closings);
        this.calculateNextClosing(closings);
        this.calculateNextGorgeOpening(closings);
        this.calculateNextOpening(closings);
        this.gorgeClosingTime = this.gorgeClosingTime < this.parkClosingTime
            ? this.gorgeClosingTime : this.parkClosingTime;
        this.gorgeOpeningTime = this.gorgeOpeningTime > this.parkOpeningTime
            ? this.gorgeOpeningTime : this.parkOpeningTime;
    }

    static pluralS(quantity: number) {
        return quantity === 1 ? '' : 's';
    }

    static timeTillMessage(time: moment.Moment) {
        let now = moment();
        if (time.isSame(now, 'day')) {
            let hours = time.diff(now, 'hours');
            let minutes = time.diff(now, 'minutes') % 60;
            let hourPart = `${hours} hour${this.pluralS(hours)}`;
            if (hours === 0) {
                hourPart = '';
            }
            let minutePart = `${minutes} minute${this.pluralS(minutes)}`;
            if (minutes === 0) {
                minutePart = '';
            }
            if (hourPart !== '' && minutePart !== '') {
                hourPart += ' and';
            }
            if (hourPart === '' && minutePart === '') {
                return 'in a moment';
            }
            return `at ${time.format('h:mm')} (in ${hourPart} ${minutePart})`;
        }
        else {
            let day = time.calendar(now, {
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

    ngOnDestroy() {
        Closing.unregister(this);
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    newClosings(closings: Closing[]) {
        HoursMessageComponent.cachedClosings = closings;
        this.getClosingsAndCalculateTimes();
    }

    refresh() {
        this.getClosingsAndCalculateTimes(false);
    }

    getClosingsAndCalculateTimes(useCached: boolean = true) {
        let self = this;
        self.loading = true;
        if (useCached && HoursMessageComponent.cachedClosings !== null) {
            HoursMessageComponent.calculateTimes();
            self.calculateText();
            self.loading = false;
            return;
        }
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

    calculateText() {
        let openingTime = HoursMessageComponent.parkOpeningTime;
        let gorgeOpeningTime = HoursMessageComponent.gorgeOpeningTime;
        let closingTime = HoursMessageComponent.parkClosingTime;
        let gorgeClosingTime = HoursMessageComponent.gorgeClosingTime;
        let now = moment();
        if (closingTime < now || openingTime < now) {
            if (!this.loading) {
                this.getClosingsAndCalculateTimes();
            }
            return;
        }
        if (closingTime < openingTime) {
            if (closingTime <= gorgeClosingTime) {
                this.text = `The park closes ${HoursMessageComponent.timeTillMessage(closingTime)}.`;
            }
            else {
                this.text =
                    `The gorge closes ${HoursMessageComponent.timeTillMessage(gorgeClosingTime)}.` +
                    `The park will be closed ${HoursMessageComponent.timeTillMessage(closingTime)}.`;
            }
        }
        else {
            this.text = `The park is closed and will open again ${HoursMessageComponent.timeTillMessage(openingTime)}.`;
            if (openingTime < gorgeOpeningTime) {
                this.text += ` The gorge will open ${HoursMessageComponent.timeTillMessage(gorgeOpeningTime)}`;
            }
        }
    }
}
