import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DevicesPage } from '../devices/devices';
import { GooglePlus } from '@ionic-native/google-plus';
import { MenuController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import firebase from 'firebase';
import { UserService } from '../../app/user.service';
import { Storage } from '@ionic/storage';
 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GooglePlus]
})
export class LoginPage {

  rootPage: any;

<<<<<<< HEAD
  constructor(public navCtrl: NavController, navParams: NavParams, private googlePlus: GooglePlus, public menu: MenuController, public plt: Platform) {
    this.plt.ready().then((readySource) => {
      firebase.auth().onAuthStateChanged( user => {
        if (user){
          this.userProfile = user;
        } else { 
          this.userProfile = null; 
        }
      });
=======
  constructor(public navCtrl: NavController, navParams: NavParams, private googlePlus: GooglePlus, public menu: MenuController, private userService: UserService, private storage: Storage) {
    storage.get('id').then( (uid) => {
      if (uid != '') {
        userService.setUser(uid)
        this.navCtrl.setRoot(DevicesPage)
      }
    })
    
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        userService.setUser(user.uid);
      }
>>>>>>> fb-updates
    });
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }
  ionViewDidLeave(){
    this.menu.enable(true);
  }

  loginUser(): void {
<<<<<<< HEAD
    this.plt.ready().then((readySource) => {
      this.googlePlus.login({
        'webClientId': '106817834441-pm6g6ublg1ru4mbvt61i6on74uuspck0.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.navCtrl.push(SetupPage, {idToken: res.idToken});
          })
          .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
        }).catch(err => console.error("Error: ", err));
    }
  )};
=======
    this.googlePlus.login({
      'webClientId': '106817834441-pm6g6ublg1ru4mbvt61i6on74uuspck0.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then( user => {
          console.log("Firebase success: " + JSON.stringify(user));
          this.userService.setUser(user.uid);
          this.storage.set('id', user.uid).then( () => {
            this.navCtrl.setRoot(DevicesPage);
          })
        })
        .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
  }

>>>>>>> fb-updates
}
