import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SetupPage } from '../pages/setup/setup';
import { ConfigurePage } from '../pages/configure/configure';
import { DevicesPage } from '../pages/devices/devices';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { Ng2OdometerModule } from 'ng2-odometer';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { HeaterService } from './heater.service';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SetupPage,
    ConfigurePage,
    DevicesPage,
    DashboardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    Ng2OdometerModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG)  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SetupPage,
    ConfigurePage,
    DevicesPage,
    DashboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    BLE,
    AngularFireDatabase,
    HeaterService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
