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
import { GoogleMapsPage } from '../pages/maps/google-maps-page/google-maps-page';
import { TrailsPage } from '../pages/maps/trails-page/trails-page';
import {CumminsFallsEventsProvider} from '../providers/events/events';
import {ViewClosingsPage} from "../pages/view-closings/view-closings";
import {ScheduleClosingPage} from "../pages/schedule-closing/schedule-closing";
import {DatePicker} from "@ionic-native/date-picker";
import {LoadingProvider} from '../providers/loading/loading';
import {EmailProvider} from "../providers/email/email";
import {RangerInfoPage} from "../pages/ranger-info/ranger-info";
import {ManageRangerPage} from "../pages/manage-ranger/manage-ranger";
import {RangerHomePage} from "../pages/ranger-home/ranger-home";
import {CreateRangerPage} from "../pages/create-ranger/create-ranger";
import {ResetPasswordPage} from "../pages/reset-password/reset-password";
import {AlertErrorProvider} from '../providers/alert-error/alert-error';
import {ContactPage} from '../pages/about/contact-page/contact-page';
import {HistoryPage} from '../pages/about/history-page/history-page';
import {TrailsInfoPage} from '../pages/about/trails-info-page/trails-info-page';
import {PlacePicProvider} from '../providers/place-pic/place-pic';

import {ComponentsModule} from '../components/components.module';
import {EventPage} from '../pages/event/event';

import {InAppBrowser} from '@ionic-native/in-app-browser';

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
        RangerInfoPage,
        ManageRangerPage,
        RangerHomePage,
        CreateRangerPage,
        ResetPasswordPage,
        ScheduleClosingPage,
        ViewClosingsPage,
        EventPage,
		    ContactPage,
        HistoryPage,
        TrailsInfoPage,
        NotificationSettingsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule,
        IonicStorageModule.forRoot(),
        ComponentsModule
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
        ViewClosingsPage,
        ScheduleClosingPage,
        ResetPasswordPage,
        CreateRangerPage,
        RangerHomePage,
        ManageRangerPage,
        RangerInfoPage,
        NotificationSettingsPage,
        EventPage,
		    ContactPage,
        HistoryPage,
        TrailsInfoPage
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
        AlertErrorProvider,
        EmailProvider,
        LoadingProvider,
        DatePicker,
        CumminsFallsEventsProvider,
        InAppBrowser,
        PlacePicProvider
    ]
})
export class AppModule {
}
