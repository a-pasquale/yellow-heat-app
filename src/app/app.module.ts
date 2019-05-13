import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireFunctions } from 'angularfire2/functions';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireModule } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { BLE } from '@ionic-native/ble/ngx';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SetupPage } from '../pages/setup/setup';
import { ConfigurePage } from '../pages/configure/configure';
import { DevicesPage } from '../pages/devices/devices';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { NotificationsPage } from '../pages/notifications/notifications';
import { Ng2OdometerModule } from 'ng2-odometer';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { HeaterService } from './heater.service';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SetupPage,
    ConfigurePage,
    DevicesPage,
    DashboardPage,
    NotificationsPage
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    Ng2OdometerModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SetupPage,
    ConfigurePage,
    DevicesPage,
    DashboardPage,
    NotificationsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    BLE,
    AngularFireDatabase,
    AngularFireFunctions,
    HeaterService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
