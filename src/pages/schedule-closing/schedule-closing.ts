import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatePicker} from "@ionic-native/date-picker";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import {DatabaseProvider} from "../../providers/database/database";
import {HttpClient} from "@angular/common/http";
import {LoadingProvider} from "../../providers/loading/loading";
import * as moment from 'moment';

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
        if (this.closing.start.hours() < 22) {
            this.closing.start.hours(this.closing.start.hours() + 1);
        }
        else {
            this.closing.start.date(this.closing.start.date() + 1);
            this.closing.start.hours(6);
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
        console.log('posting', obj);
        return new Promise<boolean>((resolve, reject) => {
            DatabaseProvider.api(http, 'closings', 'post', obj, db.credentials)
                .then(() => {
                    console.log('posted closing successfully');
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
            console.log('posted');
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
                    console.log('selected date is ', date);
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

export class Closing {
    constructor(public start, public end, public startsNow, public fromOpening, public untilClosing) {
    }

    static fromObject(start, end, startsNow, fromOpening, untilClosing): Closing {
        return new Closing(moment(start), moment(end), !!startsNow, !!fromOpening, !!untilClosing);
    }

    static isSendTimeValid(date: moment.Moment): boolean {
        let minFutureSendDate = moment();
        minFutureSendDate.minutes(minFutureSendDate.minutes() + 15);
        return minFutureSendDate.valueOf() <= date.valueOf();
    }

    toObject(): Object {
        if (this.fromOpening) {
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

            console.log('too soon');
            return ScheduleClosingPage.startTimeTooSoonMessage();
        }
        let maxDate = moment(this.end.valueOf());
        if (date.valueOf() < maxDate.valueOf()) {
            console.log('well before time');
            return '';
        }
        if (date.isSame(maxDate, 'day') && (this.fromOpening || this.untilClosing)) {
            console.log('after time, but on same day and closing/opening so it\'s fine');
            return '';
        }
        console.log('definitely not fine');
        return 'Start time must be before end time.';
    }

    isEndTimeValid(date: moment.Moment): string {
        let minDate = moment(this.start.valueOf());
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
