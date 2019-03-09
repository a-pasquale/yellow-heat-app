import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';
import { ConfigurePage } from '../configure/configure';
import { NotificationsPage } from '../notifications/notifications';
import { Heater } from '../../app/heater';
import { HeaterService } from '../../app/heater.service';
import { UserService } from '../../app/user.service';
import * as moment from 'moment';

@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html'
})

export class DevicesPage {

  devices : any[];
  heater: Heater;
  heaters: any;
  afDB: AngularFireDatabase;
  
  constructor(public navCtrl: NavController, afDB: AngularFireDatabase, private userService: UserService, private heaterService: HeaterService, private zone:NgZone) {
    let devices = [];
    let user = userService.getUser();
    if ("id" in user && user.id !== null) {
      const userRef: any = afDB.object(`/users/${user.id}`).valueChanges(); 
      userRef.subscribe( (heaters) => {
        if (heaters) {
          console.log(heaters);
          for (const key of Object.keys(heaters)) {
            if (key.startsWith('esp32')) {
              let heater = heaters[key];
              console.log("Heater name: ", JSON.stringify(heater.name));
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
                  status: heater["status"],
                  fuel_supply: lastFuelReading,
                  fuel_use: totalFuelUse,
                  temp: heater["temp"],
                  lastSeen: moment.unix(heater["lastSeen"])
              }
              let pos = devices.map(d => { return d.name; }).indexOf(device.name);
              if (pos >= 0) {
                this.devices[pos] = device;
                console.log("replacing")
              } else {
                devices.push(device);
                console.log("adding ", device.name);
              }
            }
          }
          this.devices = devices;
          zone.run(() => { console.log("Updating view") });
          console.log(this.devices)
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
  notificationsPage(device: Heater) {
    this.heaterService.setHeater(device.id, device.name);
    this.navCtrl.push(NotificationsPage);
  }
}
