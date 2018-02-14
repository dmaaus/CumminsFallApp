import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";

/*
  Generated class for the AlertErrorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertErrorProvider {

    constructor(private alertCtrl: AlertController) {
        console.log('Hello AlertErrorProvider Provider');
    }

    showCallback() {
        return this.show.bind(this);
    }

    show(error) {
        this.alertCtrl.create({
            title: 'Error',
            message: error,
            buttons: ['Ok']
        }).present();
    }
}
