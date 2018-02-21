import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RangerHomePage} from './ranger-home';

@NgModule({
  declarations: [
    RangerHomePage,
  ],
  imports: [
    IonicPageModule.forChild(RangerHomePage),
  ],
})
export class RangerHomePageModule {}
