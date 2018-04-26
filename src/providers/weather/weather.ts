import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as config from '../../assets/config.json';

const UNITS = (config['Weather'])['UNITS'];
const APIKEY = (config['Weather'])['apiKey'];
const PLACEID = (config['Weather'])['placeId'];
const URL = (config['Weather'])['url'];

@Injectable()
export class WeatherProvider {

  constructor(public http: HttpClient) {
  }
  getEventsFromUrl(): Observable<Object> {
    return this.http.get<Object>(`${URL}/weather?units=${UNITS}&id=${PLACEID}&appid=${APIKEY}`, {responseType: 'json'});
  }
}

export class WeatherInfo {
  max_temp: string;
  min_temp: string;
  weather_desc: string;
  humidity: string;
  icon_id: string;
}
