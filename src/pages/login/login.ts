import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SetupPage } from '../setup/setup';
import { GooglePlus } from '@ionic-native/google-plus';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  userProfile: any = null;

  constructor(public navCtrl: NavController, navParams: NavParams, private googlePlus: GooglePlus, public menu: MenuController) {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.userProfile = user;
      } else { 
        this.userProfile = null; 
      }
    });
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }
  ionViewDidLeave(){
    this.menu.enable(true);
  }

  loginUser(): void {
    this.googlePlus.login({
      'webClientId': '106817834441-pm6g6ublg1ru4mbvt61i6on74uuspck0.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then( success => {
          console.log("Firebase success: " + JSON.stringify(success));
          this.navCtrl.push(SetupPage);
        })
        .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
  }

}
