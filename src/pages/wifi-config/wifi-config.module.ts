import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WifiConfigPage } from './wifi-config';

@NgModule({
  declarations: [
    WifiConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(WifiConfigPage),
  ],
})
export class WifiConfigPageModule {}
