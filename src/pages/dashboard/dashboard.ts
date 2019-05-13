import { Component } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireFunctions } from 'angularfire2/functions';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidgauge from 'highcharts/modules/solid-gauge';
import { Heater } from '../../app/heater';
import { HeaterService } from '../../app/heater.service';
import { User } from '../../app/user';
import { UserService } from '../../app/user.service';

HighchartsMore(Highcharts);
HighchartsSolidgauge(Highcharts);


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {

    afDB: AngularFireDatabase;
    user: User;
    heater: Heater;
    public fuel_use: number = 0.00;
    public fuel_level: number[] = [0.00];
    public config = {
        animation: 'count',
        theme: 'train-station', 
        format: 'ddd',
        auto: true,
    }
    rootPage: any;

    constructor(public navCtrl: NavController, afDB: AngularFireDatabase, private afFun: AngularFireFunctions, private heaterService: HeaterService, private userService: UserService, public toastCtrl: ToastController) {  

        this.user = userService.getUser();
        this.afDB = afDB;

        this.heater = heaterService.getHeater();
        // Global chart options
        Highcharts.setOptions({
            chart: {
                zoomType: 'x',
                backgroundColor: '#ffeca1'
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    format: '{value:%e %b}'
                },
                title: {
                    text: 'Date'
                }
            },
            series: [{
                type: 'line',
                name: 'Heater'
            }],
            time: {
                useUTC: false
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
        });

        // Temperature history
        afDB.list(`${this.user.id}/${this.heater.id}/temp`).valueChanges()
        .subscribe( 
            (temp) => { 
            let data: any[] = [];
            temp.filter( (n) => n["temp"] < 150)
            .sort((n1, n2) => n1["timestamp"] - n2["timestamp"])
            .map( (item) => data.push([ Math.round(Number(item["timestamp"])) * 1000, Math.round(Number(item["temp"])) ]) );
            Highcharts.chart('temp-history', {
                chart: {
                    type: 'spline',
                },
                yAxis: {
                    title: {
                        text: 'Temperature (F)'
                    },
                },
                series: [{
                    type: "line",
                    data: data
                }],
                tooltip: {
                    pointFormat: 'Temperature: <b>{point.y}</b><br/>',
                    valueSuffix: ' \u00B0F'
                },
            });
        });

        // Fuel use history
        afDB.list(`${this.user.id}/${this.heater.id}/data`).valueChanges()
        .subscribe( 
            (items) => { 
                let data: any[] = [];
                items.sort((n1, n2) => n1["timestamp"] - n2["timestamp"])
                .map( (item) => data.push([Math.round(Number(item["timestamp"])) * 1000, Math.round(Number(item["fuel"]*100))  ]));
        
                Highcharts.chart('container-history', {
                    chart: {
                        type: 'areaspline',
                    },
                    title: {
                        text: ''
                    },
                    yAxis: {
                        title: {
                            text: 'Fuel Level (%)'
                        },
                        max: 100,
                        min: 0
                    },
                    series: [{
                        type: "line",
                        data: data
                    }],
                    tooltip: {
                        pointFormat: 'Fuel Level: <b>{point.y}</b><br/>',
                        valueSuffix: '%'
                    },
                });
            }
        );
    }

    ionViewDidLoad() {
        // Get summary data
        console.log("heater.id: " + this.heater.id);
        let summaryRef = this.afDB.object(`/users/${this.user.id}/${this.heater.id}`).valueChanges();
        summaryRef.subscribe( summary => {
            console.log("Total fuel use: ", summary["totalFuelUse"]);
            this.fuel_use = summary["totalFuelUse"];
            this.fuel_level = [Math.round(summary["lastFuelReading"] * 100)];
            console.log("Current Fuel Level", this.fuel_level);

            // The Fuel gauge
            Highcharts.chart('fuel_supply_container', {
                chart: {
                    type: 'gauge',
                    backgroundColor: '#ffeca1',
                    plotBackgroundColor: '#ffeca1',
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    style: { fontFamily: "Economica"}
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD' as Highcharts.GradientColorObject,
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },
                // the value axis
                yAxis: {
                    min: 0,
                    max: 100,
                    minorTickInterval: null,
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',
                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        style: { fontSize: "16px" }
                    },
                    title: {
                        text: '% Full'
                    },
                    plotBands: [{
                        from: 0,
                        to: 25,
                        color: '#DF5353' // red
                    }, {
                        from: 25,
                        to: 50,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: 50,
                        to: 100,
                        color: '#55BF3B' // green
                    }]
                },
                series: [{
                    type: "gauge",
                    name: 'Fuel Level',
                    data: this.fuel_level,
                    dataLabels: {
                        format: '<span style="font-size:36px; font-family: Economica">{y}%</span>',
                        y: 36,
                        x: 10,
                        borderWidth: 0,
                    },
                    tooltip: {
                        valueSuffix: '%'
                    }
                }],
            });
        });
    }
    generateCSV() {
        var csvReport = this.afFun.httpsCallable('csvReport');
        csvReport({id: this.heater.id})
        .subscribe(resp => {
            console.log({ resp });
            const toast = this.toastCtrl.create({
                message: resp.msg,
                duration: 3000
            });
            toast.present();
        }, err => {
            console.error({ err });
            const toast = this.toastCtrl.create({
                message: "There was an error generating your report.",
                duration: 3000
            });
            toast.present();
        });
    }
}
