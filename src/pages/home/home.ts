import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  espList: any[];

  constructor(public navCtrl: NavController, public ble: BLE) {

  }

  scanForESP(){
    this.espList = [];
    this.ble.scan(['5F6D4F53-5F43-4647-5F53-56435F49445F'], 5).subscribe(device => {
      this.espList.push(device);
    }, error => {
      console.log('Bluetooth Not Working: ' + error);
    });
  }

  configureWifi(esp: any){
    var deviceId = esp.id;

    var serviceUUID = "5F6D4F53-5F43-4647-5F53-56435F49445F";
    var keyUUID = "306D4F53-5F43-4647-5F6B-65795F5F5F30";
    var valueUUID = "316D4F53-5F43-4647-5F76-616C75655F31";
    var saveUUID = "326D4F53-5F43-4647-5F73-6176655F5F32";

    this.ble.connect(deviceId).subscribe(data =>{
      this.ble.write(deviceId, serviceUUID, keyUUID, this.str2ab('wifi.sta.ssid'));
      this.ble.write(deviceId, serviceUUID, valueUUID, this.str2ab('Home-2.4'));
      this.ble.write(deviceId, serviceUUID, saveUUID, this.str2ab('0'));
      this.ble.write(deviceId, serviceUUID, keyUUID, this.str2ab('wifi.sta.pass'));
      this.ble.write(deviceId, serviceUUID, valueUUID, this.str2ab('395thomasMA22'));
      this.ble.write(deviceId, serviceUUID, saveUUID, this.str2ab('0'));
      this.ble.write(deviceId, serviceUUID, keyUUID, this.str2ab('wifi.sta.enable'));
      this.ble.write(deviceId, serviceUUID, valueUUID, this.str2ab('true'));
      this.ble.write(deviceId, serviceUUID, saveUUID, this.str2ab('2'));
    }, error =>{
      console.log('Failed to Connect');
    })

  }

  str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }


}
