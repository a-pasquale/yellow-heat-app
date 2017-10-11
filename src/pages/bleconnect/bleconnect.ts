import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { WifiConfigPage } from '../wifi-config/wifi-config';

@Component({
  selector: 'page-bleconnect',
  templateUrl: 'bleconnect.html'
})
export class BLEConnectPage {

  espList: any[];

  constructor(public navCtrl: NavController, public ble: BLE, private zone: NgZone) {
    this.espList = [];
  }

  scanForESP(){
    // start scanning
    console.log("scanning for 5 seconds");
    this.ble.scan([], 5).subscribe(
      (device) => {
        console.log(device.name);
        if (device.name.startsWith("esp")) {
          this.zone.run(() => this.espList.push(device));
        }
      }, error => {
        console.log('Bluetooth Not Working: ' + error);
      }
    );
  }

  configureWifi(esp: any){
    this.navCtrl.push(WifiConfigPage, { device: esp });
  }

}
