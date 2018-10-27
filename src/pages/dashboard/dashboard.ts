import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Observer } from 'rxjs';
import { AngularFireDatabase, AngularFireObject  } from 'angularfire2/database';
import { LoginPage } from '../login/login';
import { DevicesPage } from '../devices/devices';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidgauge from 'highcharts/modules/solid-gauge';
import { HeaterData } from '../../app/heaterdata';
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

    items: Observable<HeaterData[]>;
    chartHistory: Object;
    user: User;
    heater: Heater;
    public fuel_use: number = 0.00;
    public config = {
        animation: 'count',
        theme: 'train-station', 
        format: 'ddd',
        auto: true,
    }
    rootPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, afDB: AngularFireDatabase, private heaterService: HeaterService, private userService: UserService) {  
    this.user = userService.getUser();
    console.log("id: ", this.user.id)
    if (this.user.id == '') {
        this.rootPage = LoginPage;
        console.log("user not found");
    }
    this.heater = heaterService.getHeater();
    this.initHeater(afDB);
  }

    initHeater(afDB) {
        console.log("heater.id: " + this.heater.id);
        let totalFuelUse = afDB.object(`${this.user.id}/${this.heater.id}/totalFuelUse`).valueChanges();
        totalFuelUse.subscribe( fuel => {
            console.log("Fuel level");
            console.log(fuel);
            this.fuel_use = fuel;        
        })
        this.items = afDB.list(`${this.user.id}/${this.heater.id}/data`).valueChanges();
        this.items.subscribe( 
            (items) => { 
                var data: any[] = [];
                items.map( (item) => data.push({ x: item.timestamp, y: Number(item.fuel) }));
                data.sort((n1, n2) => n1.x - n2.x);
        
                this.chartHistory = Highcharts.chart('container-history', {
                    chart: {
                        type: 'areaspline',
                        zoomType: 'x',
                        backgroundColor: '#ffeca1'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        title: {
                                    text: 'Date'
                                }
                    },
                    yAxis: {
                        title: {
                        text: 'Fuel Level'
                        },
                        max: 1,
                        min: 0
                    },
                    series: [{
                        name: 'Heater',
                        data: data
                    }],
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                });

                // The Fuel gauge
                let currentLevel: Number[] = [Math.round(data[data.length-1].y * 100)];
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
                
                    title: {
                        text: ''
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
                            backgroundColor: '#DDD',
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
                            rotation: 'auto',
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
                        name: 'Fuel Level',
                        data: currentLevel,
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
                    credits: {
                        enabled: false
                    },
                
                });
            }
        );
    }

  loadHeaterData() {
    var data: any[] = [];

    this.items.subscribe( items => {
      items.map( (item) => data.push({ x: item.timestamp, y: Number(item.fuel) }));
      data.sort((n1, n2) => n1.x - n2.x);

      this.chartHistory = Highcharts.chart('container-history', {
        chart: {
          type: 'areaspline',
          zoomType: 'x',
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          title: {
                      text: 'Date'
                  }
        },
        yAxis: {
          title: {
            text: 'Fuel Level'
          },
          max: 1,
          min: 0
        },
        series: [{
            name: 'Heater',
            data: data
        }],
        credits: {
            enabled: false
        },
      });

      // The Fuel gauge
      let currentLevel: Number[] = [Math.round(data[data.length-1].y * 100)];
      Highcharts.chart('container-fuel', {
        chart: {
            type: 'solidgauge'
        },

        pane: {
            center: ['50%', '70%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        title: 'Fuel Level',
        // the value axis
        yAxis: {
            stops: [
              [0.3, '#DF5353'], // green
              [0.6, '#DDDF0D'], // yellow
              [0.7, '#55BF3B'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                text: '',
                y: 0
            },
            labels: {
                y: 16
            },
            min: 0,
            max: 100,
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Fuel Level',
            data: currentLevel,
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span></div>'
            },
            
            
            tooltip: {
                valueSuffix: ' %'
            }
            
        }]

        });
    });


  }
}
