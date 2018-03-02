import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";

@Injectable()
export class AlertErrorProvider {

    constructor(private alertCtrl: AlertController) {
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
