import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

const UNITS = 'imperial'
const APIKEY = 'dc202a2565696f057d5cbcb61367987b';
const PLACEID = '4618507';
const URL = 'http://api.openweathermap.org/data/2.5/weather?units='+ UNITS + '&id=' + PLACEID +'&appid='+ APIKEY;

@Injectable()
export class WeatherProvider {

  constructor(public http: HttpClient) {
  }
  getEventsFromUrl(): Observable<Object> {
    return this.http.get<Object>(URL, {responseType: 'json'});
  }
}

export class WeatherInfo {
  max_temp: string;
  min_temp: string;
  weather_desc: string;
  humidity: string;
  icon_id: string;
}
