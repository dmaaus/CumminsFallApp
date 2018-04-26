import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as config from '../../assets/config.json';

const APIKEY = (config['GooglePhotos'])['apiKey'];
const PLACEID = (config['GooglePhotos'])['placeId'];
const URL = (config['GooglePhotos'])['url'];

@Injectable()
export class PlacePicProvider {

  constructor(public http: HttpClient) {
  }
  getEventsFromUrl(): Observable<Object> {
    return this.http.get<Object>(`${URL}/json?placeid=${PLACEID}&key=${APIKEY}`, {responseType: 'json'});
  }
}
