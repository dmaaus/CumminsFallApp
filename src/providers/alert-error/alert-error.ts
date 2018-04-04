import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {LoadingProvider} from "../loading/loading";

@Injectable()
export class AlertErrorProvider {

    constructor(private alertCtrl: AlertController) {
    }

    showCallback(loading: LoadingProvider = null) {
        let self = this;
        return function (error) {
            if (loading != null) {
                loading.dismiss();
            }
            self.show(error);
        }
    }

    show(error, onDismiss: () => void = () => {
    }) {
        this.alertCtrl.create({
            title: 'Error',
            message: error,
            buttons: [{
                text: 'Ok',
                handler: onDismiss
            }],
            enableBackdropDismiss: false
        }).present();
    }
}
