import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BLEConnectPage } from '../bleconnect/bleconnect';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidgauge from 'highcharts/modules/solid-gauge';

//import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HeaterData } from '../../app/heaterdata';

HighchartsMore(Highcharts);
HighchartsSolidgauge(Highcharts);
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [
    AngularFireDatabase,
    //AngularFirestore
  ]
})

export class DashboardPage {

  items: Observable<HeaterData[]>;
  chartHistory: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams, afDB: AngularFireDatabase) {
    this.items = afDB.list('data/heater2').valueChanges();
  }

  configure() {
    this.navCtrl.push(BLEConnectPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');

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
          text: 'Fuel Consumption'
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
    });

    // The Fuel gauge
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
          data: [80],
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
  }

}
