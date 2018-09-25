import { Injectable } from '@angular/core';
import { Heater } from './heater';

@Injectable()
export class HeaterService {

    heater: Heater = {
        uuid: "",
        id: "",
        name: "",
        ssid: "",
        pass: ""
    };

    setHeater(id: string, name: string, uuid="", ssid="", pass="") {
        this.heater.uuid = uuid;
        this.heater.id = id;
        this.heater.name = name;
        this.heater.ssid = ssid;
        this.heater.pass = pass;
    }
    getHeater() {
        return this.heater;
    }
    
    constructor() {}

}