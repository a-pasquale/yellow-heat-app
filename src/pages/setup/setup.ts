import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Slides, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
<<<<<<< HEAD
import { DashboardPage } from '../dashboard/dashboard';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
=======
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { DashboardPage } from '../dashboard/dashboard';
import { UserService } from '../../app/user.service';
import { User } from '../../app/user';
>>>>>>> fb-updates

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  @ViewChild(Slides) setupSlides: Slides;
  espList: any[];
  afDB: AngularFireDatabase;
  usersRef: AngularFireObject<any>;
  heaterRef: AngularFireObject<any>;
  user: User;
  name: any;
  size: any;
  ssid: any;
  pass: any;
  heater: any;
  deviceInfo = [];

<<<<<<< HEAD
  constructor(public navCtrl: NavController, public navParams: NavParams, public ble: BLE, private zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController, public afDB: AngularFireDatabase) {
=======
  constructor(public navCtrl: NavController, public ble: BLE, private zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController, afDB: AngularFireDatabase, private userService: UserService) {
    this.afDB = afDB;
>>>>>>> fb-updates
    this.espList = [];
    this.user = userService.getUser();
    this.usersRef = afDB.object(`/users/${this.user.id}`);
  }

  ionViewDidLoad() {
    this.setupSlides.lockSwipes(true);
    this.menu.enable(false);
  }

  ionViewDidLeave(){
    this.menu.enable(true);
  }

  scanForESP(){
    this.espList = [];
    console.log("scanning for 5 seconds");

    this.ble.scan([], 5).subscribe(
      (device) => {
        console.log(device.name);
        if (device.name && device.name.startsWith("esp")) {
          this.zone.run(() => this.espList.push(device));
        }
      }, error => {
        console.log('Bluetooth Not Working: ' + error);
      }
    );
  }

  stringToBytes(string) {
    if (string) {
      var array = new Uint8Array(string.length);
      for (var i = 0, l = string.length; i < l; i++) {
          array[i] = string.charCodeAt(i);
      }
      return array.buffer;
    } else {
      return new Uint8Array(0).buffer
    }
   }

  setESP(esp: any){
    this.deviceInfo["esp"] = esp;
    this.nextSlide();
  }

  setName(){
<<<<<<< HEAD

    this.deviceInfo["localName"] = this.name;
=======
    this.deviceInfo["name"] = this.name;
>>>>>>> fb-updates
    this.nextSlide();
  }

  setSize(){
    this.deviceInfo["size"] = this.size;
    this.nextSlide();
  }

  setWifi(){
    this.deviceInfo["ssid"] = this.ssid;
    this.deviceInfo["pass"] = this.pass;
    this.flashEsp();
  }
  nextSlide(){
    this.setupSlides.lockSwipes(false);
    this.setupSlides.slideNext();
    this.setupSlides.lockSwipes(true);
  }

  openDashboard(){
    this.navCtrl.setRoot(DashboardPage);
  }

  flashEsp(){

    const loading = this.loadingCtrl.create({
      content: 'Setting Up Your Heater...'
    });

    const serviceUUID = "5F6D4F53-5F43-4647-5F53-56435F49445F";
    const keyUUID = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
    const valueUUID = "316D4F53-5F43-4647-5F76-616C75655F31";
    const saveUUID = "326D4F53-5F43-4647-5F73-6176655F5F32";

    const ssid = this.deviceInfo["ssid"];
    const pass = this.deviceInfo["pass"] || "";
    const deviceId = this.deviceInfo["esp"].id;
    const heater = this.deviceInfo["esp"].name;
    console.log(heater);
    
    loading.present();

    this.ble.connect(deviceId).subscribe(
      (data) => {
        //console.log(JSON.stringify(data));
        this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('app.uid')).then(
          () => {
            this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(this.user.id)).then(
              () => {
                this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                  () => {
                    this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.ssid')).then(
                      () => {
                        this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(ssid)).then(
                          () => {
                            this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                              () => {
                                if (pass.length > 0) {
                                  this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.pass')).then(
                                    () => {
                                      this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(pass)).then(
                                        () => {
                                          this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                                            () => {
                                              this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.enable')).then(
                                                () => {
                                                  this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes('true')).then(
                                                    () => {
                                                      this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('2')).then(
                                                        () => {
                                                                  this.heaterRef = this.afDB.object(`/${this.user.id}/${heater}`);
                                                                  this.heaterRef.set( { 
                                                                    tankSize: this.deviceInfo["size"],
                                                                    name: this.deviceInfo["name"],
                                                                    data: ""
                                                                  });
                                                                  this.ble.disconnect(deviceId);
                                                                  loading.dismiss();
                                                                  this.nextSlide();
                                                                }
                                                      ).catch(
                                                        (error) => {
                                                          loading.dismiss().then( 
                                                            () => {
                                                              alert("Error: " + error);
                                                            }
                                                          );
                                                          console.error("Error: " + error);
                                                        }
                                                      )
                                                    }
                                                  )
                                                }
                                              )
                                            }
                                          )
                                        }
                                      )
                                    }
                                  )
                                } else {
                                  this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.enable')).then(
                                    () => {
                                      this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes('true')).then(
                                        () => {
<<<<<<< HEAD
                                          loading.dismiss();
                                          this.ble.disconnect(deviceId);
                                          const afList = this.afDB.list('users/' + 'userIdNotWorking' + '/heaters');
                                          afList.push({name: this.deviceInfo["esp"].name, tankSize: this.deviceInfo['size'],  localName: this.deviceInfo['localName']});
                                          const listObservable = afList.snapshotChanges();
                                          listObservable.subscribe();
                                          this.nextSlide();
=======
                                          this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('2')).then(
                                            () => {
                                                      this.heaterRef = this.afDB.object(`/${this.user.id}/${heater}`);
                                                      this.heaterRef.set( { 
                                                        tankSize: this.deviceInfo["size"],
                                                        name: this.deviceInfo["name"],
                                                        data: ""
                                                      });
                                                      this.ble.disconnect(deviceId);
                                                      loading.dismiss();
                                                      this.nextSlide();
                                                    }
                                          ).catch(
                                            (error) => {
                                              loading.dismiss().then( 
                                                () => {
                                                  alert("Error: " + error);
                                                }
                                              );
                                              console.error("Error: " + error);
                                            }
                                          )
>>>>>>> fb-updates
                                        }
                                      )
                                    }
                                  )
                                }
                              }
                            ).catch(
                              (error) => {
                                console.error(error);
                              }
                            )
                          }
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }, (error: any) => {
        console.log(error);
      }
    );
  }
}
