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
  selector: 'page-configure',
  templateUrl: 'configure.html'
})
export class ConfigurePage {
  @ViewChild(Slides) slides: Slides;
  afDB: AngularFireDatabase;
  usersRef: AngularFireObject<any>;
  heaterRef: AngularFireObject<any>;
  heater: Heater;
  user: User;
  showSpinner:boolean = false;
  nameForm: FormGroup;
  wifiForm: FormGroup;

  constructor(public navCtrl: NavController, public ble: BLE, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController, afDB: AngularFireDatabase, private userService: UserService, private heaterService: HeaterService) {
    this.afDB = afDB;
    this.user = userService.getUser();
    this.heater = heaterService.getHeater();
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
    console.log("Configuring heater: " + JSON.stringify(this.heater));
    this.scanForESP();
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.menu.enable(false);
  }

  ionViewDidLeave(){
    this.menu.enable(true);
  }

  scanForESP(){
    console.log("scanning for 5 seconds");
    this.showSpinner = true;
    this.ble.scan([], 5).subscribe(
      (device) => {
        if (device.name == this.heater.id) {
          console.log("Found the heater");
          this.heater.uuid = device.id;
          this.heater.id = device.name;
          this.nextSlide();
        }
      }, error => {
        this.showSpinner = false;
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
    }
   }

  nextSlide(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  openDevices(){
    this.navCtrl.setRoot(DevicesPage);
  }
 
  setWifi(){
    const loading = this.loadingCtrl.create({
      content: 'Configuring...'
    });
    loading.present();

    const refreshToken = this.user.refreshToken;
    const deviceId = this.heater["uuid"];

    // BLE characteristics
    const serviceUUID: string = "5F6D4F53-5F43-4647-5F53-56435F49445F";
    const keyUUID: string = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
    const valueUUID: string = "316D4F53-5F43-4647-5F76-616C75655F31";
    const saveUUID: string = "326D4F53-5F43-4647-5F73-6176655F5F32";

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
                                                                            this.heaterRef = this.afDB.object(`/users/${this.user.id}/${this.heater.id}`);
                                                                            this.heaterRef.update( { 
                                                                              name: this.heater["name"],
                                                                            });
                                                                            this.ble.disconnect(deviceId);
                                                                            this.heaterService.setHeater(this.heater.id, this.heater.name, this.heater.uuid, this.heater.ssid, this.heater.pass);
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