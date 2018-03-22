import {Injectable} from '@angular/core';
import {Loading, LoadingController} from "ionic-angular";

@Injectable()
export class LoadingProvider {

    private loading: Loading = null;

    constructor(private loadingCtrl: LoadingController) {
    }

    present(persistent = false, backdropDismiss = false) {
        this.loading = this.loadingCtrl.create({
            dismissOnPageChange: !persistent,
            content: 'Loading...',
            enableBackdropDismiss: backdropDismiss
        });
        this.loading.present();
    }

    dismiss() {
        if (this.loading !== null) {
            this.loading.dismiss();
            this.loading = null;
        }
    }


}
