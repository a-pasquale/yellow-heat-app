import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SetupPage} from '../pages/setup/setup';
import { DevicesPage } from '../pages/devices/devices';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { UserService } from './user.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: NavController;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private googlePlus: GooglePlus, private userService: UserService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  showDevices(){
    this.rootPage = DevicesPage;
  }
  setupPage() {
    this.nav.push(SetupPage);
  }
  logOut(){
    console.log("Logging out...");
    firebase.auth().signOut().catch( () => { console.log("Error with Firebase logout") });
    this.googlePlus.logout().catch( () => { console.log("Error with Google logout") });
    this.userService.setUser('', '');
    this.nav.setRoot(LoginPage);
  }


}

