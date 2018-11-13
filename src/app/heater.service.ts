import { Injectable } from '@angular/core';
import { Heater } from './heater';

@Injectable()
export class HeaterService {

    heater: Heater = {
        id: "",
        name: "",
        uuid: "",
        ssid: "",
        pass: "",
        size: 0
    };

    setHeater(id: string, name: string, uuid="", ssid="", pass="", size=0) {
        this.heater.uuid = uuid;
        this.heater.id = id;
        this.heater.name = name;
        this.heater.ssid = ssid;
        this.heater.pass = pass;
        this.heater.size = size;
    }
    getHeater() {
        return this.heater;
    }
    
    constructor() {}

}