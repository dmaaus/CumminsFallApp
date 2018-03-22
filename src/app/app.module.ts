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
import {CreateRangerPage} from "../pages/create-ranger/create-ranger";
import {RangerHomePage} from "../pages/ranger-home/ranger-home";
import {ManageRangerPage} from "../pages/manage-ranger/manage-ranger";
import {RangerInfoPage} from "../pages/ranger-info/ranger-info";
import {EmailProvider} from "../providers/email/email";
import {LoadingProvider} from '../providers/loading/loading';
import { VisitorAnalyticsProvider } from '../providers/visitor-analytics/visitor-analytics';
import { CumminsFallsEventsProvider } from '../providers/events/event';
import {DatePicker} from "@ionic-native/date-picker";
import {ScheduleClosingPage} from "../pages/schedule-closing/schedule-closing";
import {ViewClosingsPage} from "../pages/view-closings/view-closings";

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
        ResetPasswordPage,
        ScheduleClosingPage,
        ViewClosingsPage
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
        ResetPasswordPage,
        ScheduleClosingPage,
        ViewClosingsPage
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
    VisitorAnalyticsProvider
    ]
})
export class AppModule {
}
