import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SetupPage} from '../pages/setup/setup';
import { ConfigurePage} from '../pages/configure/configure';
import { DevicesPage } from '../pages/devices/devices';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { UserService } from './user.service';
import { Storage } from '@ionic/storage'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private googlePlus: GooglePlus, private userService: UserService, private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      const unsubscribe = firebase.auth().onAuthStateChanged( user => {
        if (!user) {
          this.rootPage = DevicesPage;
          unsubscribe();
        } else { 
          this.rootPage = DevicesPage;
          unsubscribe();
        }
      });
    });
  }
  showDevices(){
    this.rootPage = DevicesPage;
  }
  logOut(){
    firebase.auth().signOut();
    this.googlePlus.logout();
    this.userService.setUser('')
    this.storage.set('id', '').then( () => {
      this.rootPage = LoginPage;
    })
  }


}

