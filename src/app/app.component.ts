import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {NotificationProvider} from "../providers/notification/notification";
import {HttpClient} from "@angular/common/http";
import {Closing} from "../pages/schedule-closing/schedule-closing";

@Component({
    templateUrl: 'app.html',
})
export class App {
    rootPage: any = TabsPage;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private notification: NotificationProvider,
                private http: HttpClient) {
        let self = this;
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            this.notification.promptLocation();
            document.addEventListener('resume', self.onResume.bind(self), false);
        });
    }

    onResume() {
        Closing.getClosings(this.http, false);
    }

}
