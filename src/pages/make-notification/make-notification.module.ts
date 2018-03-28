import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MakeNotificationPage} from './make-notification';

@NgModule({
  declarations: [
    MakeNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeNotificationPage),
  ],
})
export class MakeNotificationPageModule {}
