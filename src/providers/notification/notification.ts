import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AlertController} from "ionic-angular";
import {OneSignal} from "@ionic-native/onesignal";

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  appId: string = '44279501-70f1-4ee1-90a8-d98ef73f3ce1';
  apiKey: string = 'N2NjMzI0MTktODBhMC00OTAxLWEzZjAtODVlM2Y0YzQwMDdj';
  googleProjectNumber: string = '386934932788';

  constructor(public http: HttpClient, private oneSignal: OneSignal, private alertCtrl: AlertController) {
    this.oneSignal.startInit(
      this.appId,
      this.googleProjectNumber)
      .handleNotificationOpened((jsonData) => {
        // TODO update park closing information on home screen
        console.log('notification opened: ' + JSON.stringify(jsonData));
      })
      .endInit();
  }

  post(title, message) {
    // TODO in the area only
    let body = {
      app_id: this.appId,
      contents: {'en': message},
      headings: {'en': title},
      included_segments: ['All']
    };

    let headers = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=utf-8')
      .append('Authorization', 'Basic ' + this.apiKey);


    this.http.post(
      'https://onesignal.com:443/api/v1/notifications', body, {headers: headers})
      .subscribe(() => {
        this.alertCtrl.create({
          title: 'Alert Sent',
          message: 'The alert was successfully sent out to people in the area',
          buttons: ['OK']
        }).present();
      }, err => {
        console.log(err);
        let message = err.message;
        if (err.status === 0) {
          message = 'Unable to connect to server. Are you connected to the Internet?'
        }
        this.alertCtrl.create({
          title: 'Error',
          message: message,
          buttons: ['OK']
        }).present();
      });
  }

}
