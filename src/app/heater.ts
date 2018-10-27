export class Heater {
    uuid: string; // UUID
    id: string;   // esp32_XXXXXXX
    name: string; // Descriptive name
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