import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Slides, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { DashboardPage } from '../dashboard/dashboard';
import { UserService } from '../../app/user.service';
import { User } from '../../app/user';

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

  constructor(public navCtrl: NavController, public ble: BLE, private zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController, afDB: AngularFireDatabase, private userService: UserService) {
    this.afDB = afDB;
    this.espList = [];
    this.user = userService.getUser();
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
        console.log("device.name: " + device.name);
        console.log("device: ", JSON.stringify(device));
        if (device.name == this.heater.id) {
          console.log("match");
          this.heater.uuid = device.id;
          this.heater.id = device.name;
          this.nextSlide();
        }
        // console.log(device.name);
        // if (device.name && device.name.startsWith("esp")) {
        //   this.zone.run(() => this.espList.push(device));
        // }
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
    this.nextSlide();
  }

  setName(){
    this.nextSlide();
  }

  setSize(){
    this.nextSlide();
  }

  setWifi(){
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
    const refreshToken = this.user.refreshToken;
    console.log(heater);
    
    loading.present();

    this.ble.connect(deviceId).subscribe(
      (data) => {
        this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('user.uid')).then(
          () => {
            this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(this.user.id)).then(
              () => {
                this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                  () => {
                    this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('user.refreshToken')).then(
                      () => {
                        this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(refreshToken)).then(
                          () => {
                            this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                              () => {
                                this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.ssid')).then(
                                  () => {
                                    this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(this.heater.ssid)).then(
                                      () => {
                                        this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                                          () => {
                                            this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.pass')).then(
                                              () => {
                                                this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(this.heater.pass)).then(
                                                  () => {
                                                    this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                                                      () => {
                                                        this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.enable')).then(
                                                          () => {
                                                            this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes('true')).then(
                                                              () => {
                                                                this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('2')).then(
                                                                  () => {
                                                                    this.usersRef = this.afDB.object(`/users/${this.user.id}/${heater}`);
                                                                    this.usersRef.set( { 
                                                                      name: this.deviceInfo["name"],
                                                                      tankSize: this.deviceInfo["size"],
                                                                      totalFuelUse: 0,
                                                                      lastFuelReading: 0,
                                                                      status: 'off',
                                                                      temp: 0
                                                                    });
                                                                    this.heaterRef = this.afDB.object(`/${this.user.id}/${heater}`);
                                                                    this.heaterRef.set( { 
                                                                      data: '',
                                                                      temp: ''
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
                                                                    console.log("Error: " + error);
                                                                  }
                                                                )
                                                              }
                                                            )
                                                          }
                                                        ).catch(
                                                          (error) => {
                                                            console.log(error);
                                                          }
                                                        )
                                                      }
                                                    )
                                                  }
                                                )
                                              }
                                            )
                                          }
                                        ).catch(
                                          (error) => {
                                            console.log(error);
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
                  }
                ).catch(
                  (error) => {
                    console.log(error);
                  }
                )
              }
            )
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        )
      }, (error: any) => {
        console.log(JSON.stringify(error));
      }
    );
  }
}