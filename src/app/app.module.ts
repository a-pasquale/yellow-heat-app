import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';

import { MyApp } from './app.component';
import { BLEConnectPage } from '../pages/bleconnect/bleconnect';
import { WifiConfigPage } from '../pages/wifi-config/wifi-config';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

const FIREBASE_CONFIG = {
/*
    apiKey: "AIzaSyCCDOS8LVhqdKyDAhHVoB_PtLi_QnBedMQ",
    authDomain: "yellow-heat-db.firebaseapp.com",
    databaseURL: "https://yellow-heat-db.firebaseio.com",
    projectId: "yellow-heat-db",
    storageBucket: "yellow-heat-db.appspot.com",
    messagingSenderId: "946834357215"

    */
    apiKey: "AIzaSyCAP_7L6baDzzrsG6hwXHzOrXV-X2LH1Gg",
    authDomain: "yellow-heat.firebaseapp.com",
    databaseURL: "https://yellow-heat.firebaseio.com",
    projectId: "yellow-heat",
    storageBucket: "yellow-heat.appspot.com",
    messagingSenderId: "106817834441"
}

@NgModule({
  declarations: [
    MyApp,
    BLEConnectPage,
    WifiConfigPage,
    DashboardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BLEConnectPage,
    WifiConfigPage,
    DashboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    BLE,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
