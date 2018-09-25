import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject  } from 'angularfire2/database';
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';
import { SetupPage } from '../setup/setup';
import { ConfigurePage } from '../configure/configure';
import { Heater } from '../../app/heater';
import { HeaterService } from '../../app/heater.service';
import { UserService } from '../../app/user.service';

@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html'
})
export class DevicesPage {

  devices : any;
  heater: Heater;
  
  constructor(public navCtrl: NavController, afDB: AngularFireDatabase, private userService: UserService, private heaterService: HeaterService) {
    this.devices = [];
    let user = userService.getUser();
    console.log(JSON.stringify(user));
    if ("id" in user && user.id !== null) {
      const userRef: any = afDB.object(`/${user.id}`).valueChanges(); 
      userRef.subscribe( (heaters) => {
        if (heaters) {
          for (const key of Object.keys(heaters)) {
            let heater = heaters[key];
            console.log(JSON.stringify(heater.name));
            console.log("devices ", JSON.stringify(this.devices));
            let lastFuelReading = 0;
            if (!isNaN(heater["lastFuelReading"])) {
              lastFuelReading = Math.round(heater["lastFuelReading"] * 100);
            }
            let totalFuelUse = 0;
            if (!isNaN(heater["totalFuelUse"])) {
              totalFuelUse = Math.round(heater["totalFuelUse"]);
            }
            let device = {
                id: key,
                name: heater["name"],
                fuel_supply: lastFuelReading,
                fuel_use: totalFuelUse
              }
              if (!this.devices.find(d => d.name === device.id)) {
                this.devices.push(device);
              }
          }
        }
      })
    } else {
      this.navCtrl.setRoot(LoginPage);
    }
  }
  viewHeater(device: Heater) {
    this.heaterService.setHeater(device.id, device.name);
    this.navCtrl.push(DashboardPage);
  }
  configurePage(device: Heater) {
    this.heaterService.setHeater(device.id, device.name);
    this.navCtrl.push(ConfigurePage);
  }
  setupPage() {
    this.navCtrl.push(SetupPage);
  }
}
