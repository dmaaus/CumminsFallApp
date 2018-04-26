import { Injectable } from "@angular/core";
//import {HTTP, HTTPResponse} from '@ionic-native/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as config from '../../assets/config.json';

const AWSURL = (config['VisitorAnalytics'])['url'];
const APIKEY = (config['VisitorAnalytics'])['apiKey'];

@Injectable()
export class VisitorAnalyticsProvider {
    httpHeaders : HttpHeaders;

    constructor(private http:HttpClient){
        this.httpHeaders = new HttpHeaders()
            .append('x-api-key', APIKEY)
            .append('functionName', '')
            .append('dt', '')
            .append('dtEnd', '');
    }

    public getCountByYear(year: number) : Promise<number>  {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'CountPerYear')
            .set('dt', `${year}-01-01`);
        return new Promise((reason, reject) => {
            this.http.get(AWSURL, {
                headers: this.httpHeaders
            }).subscribe(res => {
                const status = res['statusCode'] as number;
                //Ok response
                if(status >= 200 && status <= 299)
                {
                    const body = res['body'];

                    reason(body['count']);
                }else if(status >= 400 && status <= 599) {
                    //Error Response
                    const body = res['body'];

                    reject(body.error);
                }
            }, err => {
                reject(err);
            })
        })
    }

    public getCountsForBusiestDay(): Promise<Object> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'BusiestDays');

        return new Promise((reason, reject) => {
            this.http.get(AWSURL, {
                headers: this.httpHeaders
            }).subscribe(res => {
                const status = res['statusCode'] as number;

                if(status >= 200 && status <= 299)
                {
                    reason(res['body']);
                }else if(status >= 400 && status <= 599)
                {
                    const body = res['body'];
                    reject(body.error);
                }
            }, err => {
                reject(err);
            });
        });
    }

    public getCountsForBusiestHours() : Promise<Object> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'BusiestHours');

        return new Promise((reason, reject) => {
            this.http.get(AWSURL, {
                headers: this.httpHeaders
            }).subscribe(res => {
                const status = res['statusCode'] as number;

                if(status >= 200 && status <= 399)
                {
                    reason(res['body']);
                }else if(status >= 400 && status <= 599)
                {
                    const body = res['body'];
                    reject(body.error);
                }
            }, err => reject(err));
        });
    }

    public getCountForSelectedMonth(date: Date) : Promise<number> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'CountPerMonth')
            .set('dt', this.toMysqlDateFormat(date));

        return new Promise((reason, reject) => {
            this.http.get(AWSURL, {
                headers: this.httpHeaders
            }).subscribe(res => {
                const status = res['statusCode'] as number;

                if(status >= 200 && status <= 399)
                {
                    const body = res['body'];
                    reason(body['count']);
                }else if (status >= 400 && status <= 599)
                {
                    const body = res['body'];
                    reject(body.error);
                }
            }, err => reject(err));
        });
    }
    
    public getCountForSelectedDate(date: Date) : Promise<number> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'CountPerDay')
            .set('dt', this.toMysqlDateFormat(date));

            return new Promise((reason, reject) => {
                this.http.get(AWSURL, {
                    headers: this.httpHeaders
                }).subscribe(res => {
                    const statusCode = res['statusCode'] as number;

                    if(statusCode >= 200 && statusCode <= 399)
                    {
                        const body = res['body'];
                        reason(body['count']);
                    }else if(statusCode >= 400 && statusCode <= 499)
                    {
                        const body = res['body'];
                        reject(body.error);
                    }
                }, err => reject(err));
            });
    }

    public getCountForDateRange(startDate: Date, endDate: Date) : Promise<Object> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'CountPerDateRange')
            .set('dt', this.toMysqlDateFormat(startDate))
            .set('dtEnd', this.toMysqlDateFormat(endDate));

            return new Promise((reason, reject) => {
            });
    }

    private twoDigits(d: number): string {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
    }
    
    private toMysqlDateFormat (date: Date) : string {
        return date.getFullYear() + "-" + this.twoDigits(1 + date.getMonth()) + "-" + this.twoDigits(date.getDate());
    }
}