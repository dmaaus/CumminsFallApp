import {MapsPage} from './../pages/maps/maps';
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
import {NotificationProvider} from '../providers/notification/notification';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {IonicStorageModule} from "@ionic/storage";
import {NotificationSettingsPage} from "../pages/notification-settings/notification-settings";
import {GoogleMapsPage} from '../pages/maps/google-maps-page/google-maps-page';
import {TrailsPage} from '../pages/maps/trails-page/trails-page';
import {AlertErrorProvider} from '../providers/alert-error/alert-error';
import {ResetPasswordPage} from "../pages/reset-password/reset-password";
import { GoogleMapsPage } from '../pages/maps/google-maps-page/google-maps-page';
import { TrailsPage } from '../pages/maps/trails-page/trails-page';
import { CumminsFallsEventsProvider } from '../providers/events/event';
@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        MapsPage,
        GoogleMapsPage,
        TrailsPage,
        SettingsPage,
        RangerLoginPage,
        RangerRegisterPage,
        RangerAlertCreatorPage,
        NotificationSettingsPage,
        RangerInfoPage,
        ManageRangerPage,
        RangerHomePage,
        CreateRangerPage,
        ResetPasswordPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule,
        IonicStorageModule.forRoot(),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        MapsPage,
        GoogleMapsPage,
        TrailsPage,
        SettingsPage,
        RangerLoginPage,
        RangerRegisterPage,
        RangerAlertCreatorPage,
        NotificationSettingsPage,
        RangerInfoPage,
        ManageRangerPage,
        RangerHomePage,
        CreateRangerPage,
        ResetPasswordPage
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
        NotificationProvider,
        AndroidPermissions,
        EmailProvider,
    AlertErrorProvider,
    CumminsFallsEventsProvider
    ]
})
export class AppModule {
}
