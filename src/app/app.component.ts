import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {NotificationProvider} from "../providers/notification/notification";
import {AuthProvider} from "../providers/auth/auth";

@Component({
    templateUrl: 'app.html',
})
export class MyApp {
    rootPage: any = TabsPage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private notification: NotificationProvider, private auth: AuthProvider) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            this.notification.promptLocation();
            setTimeout(() => {
                this.auth.login('jonmcclung', 'bbbbbbbb');
            }, 2000);
        });
    }
}
