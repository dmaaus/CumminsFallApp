import { Injectable } from "@angular/core";
//import {HTTP, HTTPResponse} from '@ionic-native/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const AWSURL = 'https://3ujc77b01b.execute-api.us-east-2.amazonaws.com/prod/visitorinfo';
const APIKEY = 'mgpLtp0bwP6XX3wFUOK2673KxF3mVrm6aVzqMfbv';

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

    public getCountByYear(year: number) : Observable<Object>  {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'CountPerYear')
            .set('dt', `${year}/01/01`);
        return this.http.get(AWSURL, {
            headers: this.httpHeaders
        });
    }

    public getCountsForBusiestDay(): Observable<Object> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'BusiestDays');

        return this.http.get(AWSURL, {
            headers: this.httpHeaders
        });
    }

    public getCountForSelectedDate(date: Date) : Observable<Object> {
        this.httpHeaders = this.httpHeaders
            .set('functionName', 'CountPerDay')
            .set('dt', date.toDateString());

            return this.http.get(AWSURL, {
                headers: this.httpHeaders
            });
    }

    public get  
}