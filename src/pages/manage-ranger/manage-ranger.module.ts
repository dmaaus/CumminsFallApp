import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ManageRangerPage} from './manage-ranger';

@NgModule({
  declarations: [
    ManageRangerPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageRangerPage),
  ],
})
export class ManagerRangerPageModule {}
