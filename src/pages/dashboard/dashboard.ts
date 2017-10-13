import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BLEConnectPage } from '../bleconnect/bleconnect';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidgauge from 'highcharts/modules/solid-gauge';

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
})
export class DashboardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  configure() {
    this.navCtrl.push(BLEConnectPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');

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

      var myChart = Highcharts.chart('container-history', {
        chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          text: 'Fuel Consumption'
        },
        xAxis: {
          categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        yAxis: {
          title: {
            text: 'Fuel Level'
          }
        },
        series: [{
          name: 'Heater 1',
          data: [1, 0.8, 0.6, 0.4, 1.0, 1, 0.9]
        }],
        credits: {
            enabled: false
        },
      });
  }

}
