import {MapsPage} from './../pages/maps/maps';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AlertController, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {App} from './app.component';

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
import { CumminsFallsEventsProvider } from '../providers/events/events';
import {DatePicker} from "@ionic-native/date-picker";
import {ScheduleClosingPage} from "../pages/schedule-closing/schedule-closing";
import {ViewClosingsPage} from "../pages/view-closings/view-closings";

import {ComponentsModule} from '../components/components.module';
import {EventPage} from '../pages/event/event';

import {InAppBrowser} from '@ionic-native/in-app-browser';
import {MakeNotificationPage} from "../pages/make-notification/make-notification";
import {ContactPage} from "../pages/about/contact-page/contact-page";
import {HistoryPage} from "../pages/about/history-page/history-page";
import {TrailsInfoPage} from "../pages/about/trails-info-page/trails-info-page";

// import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    declarations: [
        App,
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
        ViewClosingsPage,
        EventPage,
        MakeNotificationPage,
        ContactPage,
        HistoryPage,
        TrailsInfoPage,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(App),
		// PdfViewerModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        ComponentsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
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
        ViewClosingsPage,
        EventPage,
        MakeNotificationPage,
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
    VisitorAnalyticsProvider
    ]
})
export class AppModule {
}
