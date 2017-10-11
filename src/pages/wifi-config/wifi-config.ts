import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BLE } from '@ionic-native/ble';

/**
 * Generated class for the WifiConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wifi-config',
  templateUrl: 'wifi-config.html'
})
export class WifiConfigPage {

  public device;
  private wifiConfigForm : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public ble: BLE,) {
    this.device = navParams.get("device");

    this.wifiConfigForm = this.formBuilder.group({
      ssid: ['', Validators.required],
      password: [''],
    });
  }
  stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }
  WifiConfigSubmit() {
    console.log(this.wifiConfigForm.value.ssid);
    let ssid = this.wifiConfigForm.value.ssid;
    let pass = this.wifiConfigForm.value.password;

    var deviceId = this.device.id;
    console.log("Device Id: ", deviceId);

    const serviceUUID = "5F6D4F53-5F43-4647-5F53-56435F49445F";
    const keyUUID = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
    const valueUUID = "316D4F53-5F43-4647-5F76-616C75655F31";
    const saveUUID = "326D4F53-5F43-4647-5F73-6176655F5F32";

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
                                          console.log("Updated WIFI configuration");
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

    /*
      function(response) {
          console.log("response: ", response);
      },
      function(err){
          alert("An error occurred. Please try again.");
      }
      */
      /*

      }
      */

/*
    this.ble.write(deviceId, serviceUUID, keyUUID, btoa('wifi.sta.pass'));
    this.ble.write(deviceId, serviceUUID, valueUUID, btoa('395thomasMA22'));
    this.ble.write(deviceId, serviceUUID, saveUUID, btoa('0'));
    this.ble.write(deviceId, serviceUUID, keyUUID, btoa('wifi.sta.enable'));
    this.ble.write(deviceId, serviceUUID, valueUUID, btoa('true'));
    this.ble.write(deviceId, serviceUUID, saveUUID, btoa('2'));

  }, error =>{
    console.log('Failed to Connect');
  })


  ionViewDidLoad() {
    console.log('ionViewDidLoad WifiConfigPage');
  }
  */

}
