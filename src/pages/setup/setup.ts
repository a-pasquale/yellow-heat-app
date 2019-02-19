import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { DevicesPage } from '../devices/devices';
import { Heater } from '../../app/heater';
import { HeaterService } from '../../app/heater.service';
import { User } from '../../app/user';
import { UserService } from '../../app/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  @ViewChild(Slides) setupSlides: Slides;
  espList: any[];
  deviceInfo: any = [];
  afDB: AngularFireDatabase;
  usersRef: AngularFireObject<any>;
  heaterRef: AngularFireObject<any>;
  heater: Heater;
  user: User;
  showSpinner:boolean = false;
  nameForm: FormGroup;
  wifiForm: FormGroup;

  constructor(public navCtrl: NavController, public ble: BLE, private zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController, afDB: AngularFireDatabase, private userService: UserService) {
    this.afDB = afDB;
    this.user = userService.getUser();
    this.espList = [];
    this.heater = new Heater();
    this.nameForm = new FormGroup({
      'name': new FormControl(this.heater.name, [
        Validators.required,
        Validators.maxLength(25)
      ])
    });
    this.wifiForm = new FormGroup({
      'ssid': new FormControl(this.heater.ssid, 
        Validators.required
      )
    });
    console.log("Setting up a new heater");
    this.scanForESP();
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
        if (device.name && device.name.startsWith("esp")) {
          this.zone.run(() => this.espList.push(device));
        }
      }, error => {
        console.log('Bluetooth Not Working: ' + error);
      }
    );
  }

  stringToBytes(string = "-1") {
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
    this.heater.uuid = esp.id;
    this.heater.id = esp.name;
  }

  setWifi(){
    this.flashEsp();
  }
  nextSlide(){
    this.setupSlides.lockSwipes(false);
    this.setupSlides.slideNext();
    this.setupSlides.lockSwipes(true);
  }

  openDevicesPage(){
    this.navCtrl.setRoot(DevicesPage);
  }

  flashEsp(){

    const loading = this.loadingCtrl.create({
      content: 'Setting Up Your Heater...'
    });

    const refreshToken = this.user.refreshToken;
    const deviceId = this.heater.uuid;

    const serviceUUID = "5F6D4F53-5F43-4647-5F53-56435F49445F";
    const keyUUID = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
    const valueUUID = "316D4F53-5F43-4647-5F76-616C75655F31";
    const saveUUID = "326D4F53-5F43-4647-5F73-6176655F5F32";

    console.log(this.heater);
    
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
                                                                    this.usersRef = this.afDB.object(`/users/${this.user.id}/${this.heater.id}`);
                                                                    this.usersRef.set( { 
                                                                      name: this.heater.name,
                                                                      tankSize: this.heater.size,
                                                                      totalFuelUse: 0,
                                                                      lastFuelReading: 0,
                                                                      notificationLevel: 33,
                                                                      notifyYellowHeat: false,
                                                                      notified: false,
                                                                      tempNotificationLevel: 40,
                                                                      tempNotified: false,
                                                                      status: 'off',
                                                                      temp: 0
                                                                    });
                                                                    this.heaterRef = this.afDB.object(`/${this.user.id}/${this.heater.id}`);
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