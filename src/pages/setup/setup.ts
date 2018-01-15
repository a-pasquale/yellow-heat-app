import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { DashboardPage } from '../dashboard/dashboard'

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  @ViewChild(Slides) setupSlides: Slides;
  espList: any[];
  name: any;
  size: any;
  ssid: any;
  pass: any;

  deviceInfo = [];

  constructor(public navCtrl: NavController, public ble: BLE, private zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menu:MenuController) {
    this.espList = [];
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

  setESP(esp: any){
    this.deviceInfo["esp"] = esp;
    this.nextSlide();
  }

  setName(){

    this.deviceInfo["localSize"] = this.size;
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


  flashEsp(){

    const loading = this.loadingCtrl.create({
      content: 'Setting Up Your Heater...'
    });

    const serviceUUID = "5F6D4F53-5F43-4647-5F53-56435F49445F";
    const keyUUID = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
    const valueUUID = "316D4F53-5F43-4647-5F76-616C75655F31";
    const saveUUID = "326D4F53-5F43-4647-5F73-6176655F5F32";

    var ssid = this.deviceInfo["ssid"];
    var pass = this.deviceInfo["pass"] || "";

    var deviceId = this.deviceInfo["esp"].id;
    console.log(deviceId)

    loading.present();

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
                                          loading.dismiss();
                                          this.ble.disconnect(deviceId);
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


  nextSlide(){
    this.setupSlides.lockSwipes(false);
    this.setupSlides.slideNext();
    this.setupSlides.lockSwipes(true);
  }

  openDashboard(){
    this.navCtrl.setRoot(DashboardPage);
  }

}
