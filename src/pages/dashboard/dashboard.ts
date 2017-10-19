import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidgauge from 'highcharts/modules/solid-gauge';
import { HeaterData } from '../../app/heaterdata';

HighchartsMore(Highcharts);
HighchartsSolidgauge(Highcharts);


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  items: Observable<HeaterData[]>;
  chartHistory: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams, afDB: AngularFireDatabase, private storage: Storage) {
    this.storage.get('uid').then((uid) => {
        this.items = afDB.list('data/heater2').valueChanges();
    });;


  }

  ionViewDidLoad() {
    var data: any[] = [];

    this.items.subscribe( items => {
      items.map( (item) => data.push({ x: item.timestamp, y: Number(item.fuel) }));
      data.sort((n1, n2) => n1.x - n2.x);

      this.chartHistory = Highcharts.chart('container-history', {
        chart: {
          type: 'spline',
          zoomType: 'x'
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
      let currentLevel: Number[] = [data[data.length-1].y * 100];
      var chartFuel = Highcharts.chart('container-fuel', {
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
            /*dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span></div>'
            },
            */
            /*
            tooltip: {
                valueSuffix: ' %'
            }
            */
        }]

        });
    });


  }
}
