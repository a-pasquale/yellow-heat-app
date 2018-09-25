export class Heater {
    uuid: string;
    id: string;
    name: string;
    ssid: string;
    pass: string;

    constructor( uuid: string, id: string, name: string, ssid: string, pass: string) {
        this.uuid = uuid;
        this.id = id;
        this.name = name;
        this.ssid = ssid;
        this.pass = pass;
    }
}