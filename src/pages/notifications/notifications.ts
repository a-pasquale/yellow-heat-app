import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Heater } from '../../app/heater';
import { HeaterService } from '../../app/heater.service';
import { User } from '../../app/user';
import { UserService } from '../../app/user.service';


@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  public device: Observable<any>;
  public level: number;
  public notifyYellowHeat: boolean = false;
  public heater: Heater;
  public user: User;
  public deviceRef: AngularFireObject<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, afDB: AngularFireDatabase, private userService: UserService, private heaterService: HeaterService, public toastCtrl: ToastController) {
    this.user = userService.getUser();
    this.heater = heaterService.getHeater();
    this.deviceRef = afDB.object(`/users/${this.user.id}/${this.heater.id}`);
    this.device = afDB.object(`/users/${this.user.id}/${this.heater.id}`).valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }
  save(notificationLevel, notifyYellowHeat) {
    this.deviceRef.update( { notificationLevel: notificationLevel, notifyYellowHeat: notifyYellowHeat })
    .then( 
      () => {
        const toast = this.toastCtrl.create({
          message: 'Notification preferences updated',
          duration: 3000
        });
        toast.present();
      }
    );
  }
  updateNotification() {
    console.log("update changed");
  }

}
