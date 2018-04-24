import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';


const APIKEY = 'AIzaSyAC2eqrBHkT4fOYU5VTm503Ezh0IRlhCCg';
const PLACEID = 'ChIJuwY422ceZ4gRZEApMTbzZ-I';
const URL = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+ PLACEID +'&key='+ APIKEY;

@Injectable()
export class PlacePicProvider {

  constructor(public http: HttpClient) {
  }
  getEventsFromUrl(): Observable<Object> {
    return this.http.get<Object>(URL, {responseType: 'json'});
  }
}
