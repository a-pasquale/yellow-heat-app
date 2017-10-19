import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard'

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  @ViewChild(Slides) setupSlides: Slides;
  espList: any[];
  usersRef: AngularFireObject<any>;

  constructor(public navCtrl: NavController, public ble: BLE, private zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController, afDB: AngularFireDatabase, private storage: Storage) {
    this.espList = [];
    storage.get('uid').then((uid) => {
      this.usersRef = afDB.object(`/users/${uid}`);
    });
    
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
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
     }
     return array.buffer;
   }


  flashWifi(esp: any){
    let prompt = this.alertCtrl.create({
      title: 'Enter Credentials',
      message: "Enter your network Infomation",
      inputs: [
        {
          name: 'ssid',
          placeholder: 'SSID'
        },
        {
          name: 'password',
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {

            const loading = this.loadingCtrl.create({
              content: 'Setting Up Your Heater...'
            });

            loading.present();

            const serviceUUID = "5F6D4F53-5F43-4647-5F53-56435F49445F";
            const keyUUID = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
            const valueUUID = "316D4F53-5F43-4647-5F76-616C75655F31";
            const saveUUID = "326D4F53-5F43-4647-5F73-6176655F5F32";

            var ssid = data.ssid;
            var pass = data.password;

            var deviceId = esp.id;

            this.ble.connect(deviceId).subscribe(data => {
              console.log(JSON.stringify(data));
              this.ble.write(deviceId, serviceUUID, keyUUID, this.stringToBytes('wifi.sta.ssid')).then(
                () => {
                  this.ble.write(deviceId, serviceUUID, valueUUID, this.stringToBytes(ssid)).then(
                    () => {
                      this.ble.write(deviceId, serviceUUID, saveUUID, this.stringToBytes('0')).then(
                        () => {
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
                                                  this.storage.get('uid').then((uid) => {
                                                    this.usersRef.update({"heater": esp.name});
                                                  });;
                                                  
                                                  loading.dismiss();
                                                  this.nextSlide();
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

                      );
                    }
                  )
                }
              ).catch(
                () => {
                  console.log("error");
                }
              );
            });

          }
        }
      ]
    });
    prompt.present();
  }


  nextSlide(){
    this.setupSlides.lockSwipes(false);
    this.setupSlides.slideNext();
    this.setupSlides.lockSwipes(true);
  }

  openDashboard(){
    this.navCtrl.setRoot(DashboardPage);
  }

}
