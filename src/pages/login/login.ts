import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DevicesPage } from '../devices/devices';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from '../../app/user.service';
import { User } from '../../app/user';
import { Storage } from '@ionic/storage';
import { localConfig } from '../../app/config';
 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GooglePlus]
})
export class LoginPage {

  user: User;
  rootPage: any;
  afDB: AngularFireDatabase;

  constructor(public navCtrl: NavController, public navParams: NavParams, private googlePlus: GooglePlus, public menu: MenuController, private userService: UserService, private storage: Storage, afDB: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        console.log("User exists");
        this.userService.setUser(user.uid, user.refreshToken);
        this.navCtrl.setRoot(DevicesPage);
      }
    });
    this.afDB = afDB;
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }
  ionViewDidLeave(){
    this.menu.enable(true);
  }

  loginUser(): void {
    this.googlePlus.login({
      'webClientId': localConfig.webClientId,
      'offline': true,
    }).then( res => {
      console.log("Google login succesful")
      console.log("Signing into Firebase");
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then( () => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then( resp => {
          console.log("Firebase success");
          let refreshToken = '';
          for (var property in resp) {
            if (property == 'refreshToken') {
              refreshToken = resp[property];
            }
          }
          this.afDB.object(`/users/${resp.uid}/`).update( {
            name: res.displayName,
            email: res.email 
          })
          this.userService.setUser(resp.uid, refreshToken);
          this.navCtrl.setRoot(DevicesPage);
        }).catch( error => { 
          console.log("Firebase failure: " + JSON.stringify(error))
        });
      })
    }).catch(err => { console.log("Google login error: ", err)})
  }
}
