import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatePicker} from "@ionic-native/date-picker";
import {AlertErrorProvider} from "../../providers/alert-error/alert-error";
import * as dateformat from 'dateformat';

@IonicPage()
@Component({
    selector: 'page-schedule-closing',
    templateUrl: 'schedule-closing.html',
})
export class ScheduleClosingPage {

    callback: (sendTime: Date, message: string) => void;
    start: Date = new Date();
    end: Date = new Date();
    startsNow: boolean = false;
    fromOpening: boolean = false;
    untilClosing: boolean = true;

    // static readonly MINIMUM_START_DELAY = 15;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private datePicker: DatePicker,
                private alertError: AlertErrorProvider,
                private alertCtrl: AlertController) {
        this.callback = navParams.get('callback');
        if (this.start.getHours() < 22) {
            this.start.setHours(this.start.getHours() + 1);
        }
        else {
            this.start.setDate(this.start.getDate() + 1);
            this.start.setHours(6);
        }
        this.end.setHours(23);
    }


    isSameDay(a: Date, b: Date) {
        if (this.startsNow) a = new Date();
        let shortDate = 'm/d/yy';
        return dateformat(a, shortDate) === dateformat(b, shortDate);
    }

    getMessage() {
        let timeFormat: string = 'h:MM TT';
        let dateFormat: string = 'ddd, m/d/yy';
        let startDate = dateformat(this.start, dateFormat);
        let startTime = dateformat(this.start, timeFormat);
        let endDate = dateformat(this.end, dateFormat);
        let endTime = dateformat(this.end, timeFormat);

        let message = `Cummins Falls `;
        if (this.isSameDay(this.start, this.end)) {
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
            message += ` the end of ${endDate}`;
        }
        else {
            message += `${endDate} at ${endTime}`;
        }
        return message;
    }

    static isSendTimeValid(date: Date): boolean {
        let minFutureSendDate = new Date();
        minFutureSendDate.setMinutes(minFutureSendDate.getMinutes() + 15);
        return minFutureSendDate.getTime() <= date.getTime();
    }

    getSendTime() {
        if (this.startsNow) return new Date(0);

        let sendTime = new Date(this.start);
        if (this.fromOpening || this.start.getHours() < 12) {
            // send it the evening before
            sendTime.setDate(sendTime.getDate() - 1);
            sendTime.setHours(16);
        }
        else {
            // send it that morning
            sendTime.setHours(7);
        }
        if (ScheduleClosingPage.isSendTimeValid(sendTime)) {
            return sendTime;
        }
        return new Date(0);
    }

    submit() {
        let error = this.isStartTimeValid(this.start);
        if (error !== '') {
            this.alertError.show(error);
            return;
        }
        error = this.isEndTimeValid(this.end);
        if (error !== '') {
            this.alertError.show(error);
            return;
        }
        this.navCtrl.pop().then(() => {
            this.callback(this.getSendTime(), this.getMessage());
        });
    }

    static startTimeTooSoonMessage(): string {
        return `Start time must be in the future.`;
    }

    isTimeValid(date: Date, isEnd: boolean): string {
        if (isEnd) {
            return this.isEndTimeValid(date);
        }
        return this.isStartTimeValid(date);
    }

    isEndTimeValid(date: Date): string {
        let minDate = new Date(this.start);
        minDate.setMinutes(minDate.getMinutes() + 1);
        if (minDate.getTime() < date.getTime()) {
            return '';
        }
        if ((this.fromOpening || this.untilClosing) && this.isSameDay(minDate, date)) {
            return '';
        }
        return 'End time must be after start time.';
    }

    isStartTimeValid(date: Date): string {
        if (this.startsNow) return '';
        console.log('testing start time ' + date.toLocaleString());
        let minDate = new Date();
        minDate.setMinutes(minDate.getMinutes());
        if (minDate.getTime() > date.getTime() &&
            !(this.fromOpening && this.isSameDay(minDate, date))) {

            console.log('too soon');
            return ScheduleClosingPage.startTimeTooSoonMessage();
        }
        let maxDate = new Date(this.end);
        if (date.getTime() < maxDate.getTime()) {
            console.log('well before time');
            return '';
        }
        if (this.isSameDay(date, maxDate) && (this.fromOpening || this.untilClosing)) {
            console.log('after time, but on same day and closing/opening so it\'s fine');
            return '';
        }
        console.log('definitely not fine');
        return 'Start time must be before end time.';
    }

    setStart() {
        let self = this;
        if (self.startsNow) {
            self.startsNow = false;
        }
        self.pickDate(false).then(date => {
            self.start = date;
            if (self.untilClosing && self.end.getTime() < self.start.getTime()) {
                self.end = new Date(date);
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
            self.end = date;
            if ((self.startsNow || self.fromOpening) && self.end.getTime() < self.start.getTime()) {
                self.start = new Date(self.end);
            }
        }).catch(msg => {
            if (msg !== 'cancel') {
                self.alertError.show(msg);
            }
        });
    }

    pickDate(isEnd: boolean): Promise<Date> {
        let self = this;
        return new Promise<Date>((resolve, reject) => {
            let minDate = new Date();
            let mode = (isEnd ? this.untilClosing : this.fromOpening) ? 'date' : 'datetime';
            self.datePicker.show({
                date: isEnd ? self.end : self.start,
                mode: mode,
                minDate: minDate,
                androidTheme: self.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                allowOldDates: false
            })
                .then(date => {
                    console.log('selected date is ' + date);
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
