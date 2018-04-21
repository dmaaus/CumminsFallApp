import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatePicker} from "@ionic-native/date-picker";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {DatabaseProvider} from "../../providers/database/database";
import {HttpClient} from "@angular/common/http";
import {LoadingProvider} from "../../providers/loading/loading";
import * as moment from 'moment';
import {HoursMessageComponent} from "../../components/hours-message/hours-message";

@IonicPage()
@Component({
    selector: 'page-schedule-closing',
    templateUrl: 'schedule-closing.html',
})
export class ScheduleClosingPage {

    callback: (sendTime: moment.Moment, message: string, closing: Closing) => void;
    closing: Closing;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private datePicker: DatePicker,
                private alertError: AlertErrorProvider,
                private http: HttpClient,
                private db: DatabaseProvider,
                private loading: LoadingProvider) {

        this.callback = navParams.get('callback');
        this.closing = new Closing(moment(), moment(), false, false, true);
        if (this.closing.start.hours() > 17) {
            HoursMessageComponent.changeDay(this.closing.start, 1);
            HoursMessageComponent.changeDay(this.closing.end, 1);
            HoursMessageComponent.resetToHour(this.closing.start, 8);
            this.closing.fromOpening = true;
        }
        else {
            HoursMessageComponent.changeHours(this.closing.start, 1);
        }
        this.closing.end.hours(23);
        this.closing.end.minutes(59);
        this.closing.end.seconds(59);
        this.closing.end.millisecond(999);
    }

    static startTimeTooSoonMessage(): string {
        return `Start time must be in the future.`;
    }

    static postClosing(closing: Closing, http: HttpClient, db: DatabaseProvider): Promise<boolean> {
        let obj = closing.toObject();
        return new Promise<boolean>((resolve, reject) => {
            DatabaseProvider.api(http, 'closings', 'post', obj, db.credentials)
                .then(() => {
                    resolve(true);
                }).catch(reject);
        });
    }

    static scheduleClosing(closing: Closing,
                           alertError: AlertErrorProvider,
                           callback: (sendTime: moment.Moment, message: string, closing: Closing) => void,
                           navCtrl: NavController,
                           loading: LoadingProvider,
                           http: HttpClient,
                           db: DatabaseProvider) {
        if (closing.startsNow) {
            closing.start = moment();
        }
        if ((closing.start.hours() > 17 || closing.start.hours() < 8) && !closing.fromOpening) {
            if (closing.startsNow) {
                alertError.show('Cummins Falls is already closed');
            }
            else {
                alertError.show('Cummins Falls will already be closed at that time.');
            }
            return;
        }
        loading.present();
        let error = closing.isStartTimeValid(closing.start);
        if (error !== '') {
            alertError.show(error);
            return;
        }
        error = closing.isEndTimeValid(closing.end);
        if (error !== '') {
            alertError.show(error);
            return;
        }
        let self = this;
        self.postClosing(closing, http, db).then(() => {
            navCtrl.pop().then(() => {
                callback(closing.getSendTime(), closing.getMessage(), closing);
            });
        }).catch(alertError.showCallback(loading));
    }

    getMessage() {
        return this.closing.getMessage();
    }

    submit() {
        ScheduleClosingPage.scheduleClosing(
            this.closing,
            this.alertError,
            this.callback,
            this.navCtrl,
            this.loading,
            this.http,
            this.db);
    }

    isTimeValid(date: moment.Moment, isEnd: boolean): string {
        if (isEnd) {
            return this.closing.isEndTimeValid(date);
        }
        return this.closing.isStartTimeValid(date);
    }

    setStart() {
        let self = this;
        if (self.closing.startsNow) {
            self.closing.startsNow = false;
        }
        self.pickDate(false).then(date => {
            self.closing.start = date;
            if (self.closing.untilClosing && self.closing.end.valueOf() < self.closing.start.valueOf()) {
                self.closing.end = moment(date.valueOf());
            }
        }).catch(msg => {
            if (msg !== 'cancel') {
                self.alertError.show(msg);
            }
        });
    }

    setEnd() {
        let self = this;
        self.pickDate(true).then(date => {
            self.closing.end = date;
            if ((self.closing.startsNow || self.closing.fromOpening) && self.closing.end.valueOf() < self.closing.start.valueOf()) {
                self.closing.start = moment(self.closing.end.valueOf());
            }
        }).catch(msg => {
            if (msg !== 'cancel') {
                self.alertError.show(msg);
            }
        });
    }

    pickDate(isEnd: boolean): Promise<moment.Moment> {
        let self = this;
        return new Promise<moment.Moment>((resolve, reject) => {
            let minDate = new Date();
            let mode = (isEnd ? this.closing.untilClosing : this.closing.fromOpening) ? 'date' : 'datetime';
            self.datePicker.show({
                date: isEnd ? new Date(self.closing.end.valueOf()) : new Date(self.closing.start.valueOf()),
                mode: mode,
                minDate: minDate,
                androidTheme: self.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                allowOldDates: false
            })
                .then(dateDate => {
                    let date = moment(dateDate.getTime());
                    let error = this.isTimeValid(date, isEnd);
                    if (error !== '') {
                        reject(error);
                        return;
                    }
                    resolve(date);
                })
                .catch(reject);
        });
    }
}

export interface ClosingListener {
    newClosings: (closings: Closing[]) => void;
}

export class Closing {

    static listeners: ClosingListener[] = [];
    static cachedClosings: Closing[] = null;

    constructor(public start: moment.Moment,
                public end: moment.Moment,
                public startsNow: boolean,
                public fromOpening: boolean,
                public untilClosing: boolean) {
    }

    static register(listener: ClosingListener) {
        this.listeners.push(listener);
    }

    static unregister(listener: ClosingListener) {
        let index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
    }

    static fromObject(closing): Closing {
        return new Closing(
            moment(closing['start']),
            moment(closing['end']),
            !!(closing['startsNow']),
            !!(closing['fromOpening']),
            !!(closing['untilClosing'])
        );
    }

    static isSendTimeValid(date: moment.Moment): boolean {
        let minFutureSendDate = moment();
        minFutureSendDate.minutes(minFutureSendDate.minutes() + 15);
        return minFutureSendDate.valueOf() <= date.valueOf();
    }

    static notifyListeners(except: ClosingListener = null) {
        this.listeners.forEach(listener => {
            if (listener !== except) {
                listener.newClosings(this.cachedClosings);
            }
        });
    }

    static getClosings(http: HttpClient, useCached: boolean = true, listenerWhoRequested: ClosingListener = null): Promise<Closing[]> {
        let self = this;
        return new Promise<Closing[]>((resolve, reject) => {
            if (useCached && self.cachedClosings !== null) {
                resolve(self.cachedClosings);
                return;
            }
            DatabaseProvider.api(http, 'closings', 'get')
                .then((results: Object[]) => {
                    self.cachedClosings = results.map(Closing.fromObject);
                    self.notifyListeners(listenerWhoRequested);
                    resolve(self.cachedClosings);
                })
                .catch(reject);
        });
    }

    static cacheClosing(closing: Closing) {
        if (this.cachedClosings === null) {
            this.cachedClosings = [];
        }
        this.cachedClosings.push(closing);
        this.cachedClosings.sort((a, b) => {
            return a.start.valueOf() - b.start.valueOf();
        });
        this.notifyListeners();
    }

    toObject(): Object {
        if (this.fromOpening || this.startsNow) {
            this.start.hours(0);
            this.start.minutes(0);
            this.start.seconds(0);
            this.start.millisecond(0);
        }
        if (this.untilClosing) {
            this.end.hours(23);
            this.end.minutes(59);
            this.end.seconds(59);
            this.end.millisecond(999);
        }
        return {
            start: this.start.valueOf(),
            end: this.end.valueOf(),
            startsNow: this.startsNow ? 1 : 0,
            fromOpening: this.fromOpening ? 1 : 0,
            untilClosing: this.untilClosing ? 1 : 0
        };
    }

    getMessage() {
        let timeFormat: string = 'h:mm a';
        let dateFormat: string = 'ddd, M/D/YY';
        let startDate = this.start.format(dateFormat);
        let startTime = this.start.format(timeFormat);
        let endDate = this.end.format(dateFormat);
        let endTime = this.end.format(timeFormat);

        let message = `Cummins Falls `;
        if (this.start.isSame(this.end, 'day')) {
            if (this.startsNow) {
                message += `is now closed `;
                if (this.untilClosing) {
                    message += `for the rest of the day`;
                }
                else {
                    message += `until ${endTime}`;
                }
            }
            else if (this.fromOpening) {
                if (this.untilClosing) {
                    message += `will be closed all day ${startDate}`;
                }
                else {
                    message += `will not open until ${endTime} on ${endDate}`;
                }
            }
            else if (this.untilClosing) {
                message += `will be closing early ${startDate} at ${startTime}`
            }
            else {
                message += `will be closed from ${startTime} until ${endTime} on ${endDate}`
            }
            return message;
        }
        if (this.startsNow) {
            message += 'is now closed ';
        }
        else {
            message += `will be closed from ${startDate} `;
            if (!this.fromOpening) {
                message += `at ${startTime} `;
            }
        }
        message += 'until ';
        if (this.untilClosing) {
            message += `the end of ${endDate}`;
        }
        else {
            message += `${endDate} at ${endTime}`;
        }
        return message;
    }

    isStartTimeValid(date: moment.Moment): string {
        if (this.startsNow) return '';
        let minDate = moment();
        minDate.minutes(minDate.minutes());
        if (minDate.valueOf() > date.valueOf() &&
            !(this.fromOpening && minDate.isSame(date, 'day'))) {

            return ScheduleClosingPage.startTimeTooSoonMessage();
        }
        let maxDate = moment(this.end.valueOf());
        if (date.valueOf() < maxDate.valueOf()) {
            return '';
        }
        if (date.isSame(maxDate, 'day') && (this.fromOpening || this.untilClosing)) {
            return '';
        }
        return 'Start time must be before end time.';
    }

    isEndTimeValid(date: moment.Moment): string {
        let minDate = moment(this.start.valueOf());
        if (this.startsNow) {
            minDate = moment();
        }
        minDate.minutes(minDate.minutes() + 1);
        if (minDate.valueOf() < date.valueOf()) {
            return '';
        }
        if ((this.fromOpening || this.untilClosing) && minDate.isSame(date, 'day')) {
            return '';
        }
        return 'End time must be after start time.';
    }

    getSendTime() {
        if (this.startsNow) return moment(0);

        let sendTime = moment(this.start.valueOf());
        if (this.fromOpening || this.start.hours() < 12) {
            // send it the evening before
            sendTime.date(sendTime.date() - 1);
            sendTime.hours(16);
        }
        else {
            // send it that morning
            sendTime.hours(7);
        }
        if (Closing.isSendTimeValid(sendTime)) {
            return sendTime;
        }
        return moment(0);
    }
}
