import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AlertController, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {RangerLoginPage} from "../pages/ranger-login/ranger-login";
import {SettingsPage} from "../pages/settings/settings";
import {DatabaseProvider} from '../providers/database/database';
import {RangerRegisterPage} from "../pages/ranger-register/ranger-register";
import {AuthProvider} from '../providers/auth/auth';
import {HttpClientModule} from "@angular/common/http";
import {RangerAlertCreatorPage} from "../pages/ranger-alert-creator/ranger-alert-creator";
import {SQLite} from '@ionic-native/sqlite'
import {OneSignal} from "@ionic-native/onesignal";
import { NotificationProvider } from '../providers/notification/notification';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        SettingsPage,
        RangerLoginPage,
        RangerRegisterPage,
        RangerAlertCreatorPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        SettingsPage,
        RangerLoginPage,
        RangerRegisterPage,
        RangerAlertCreatorPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        DatabaseProvider,
        AlertController,
        AuthProvider,
        HttpClientModule,
        SQLite,
        OneSignal,
        NotificationProvider
    ]
})
export class AppModule {
}
