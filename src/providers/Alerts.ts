import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertsProvider {

  constructor(public alertController: AlertController) {
    console.log('Hello Alerts Provider');
  }

  showErrorAlert(message: string, source: string) {
    let alert = this.alertController.create({
      title: 'Error',
      subTitle: 'Source: ' + source,
      message: message,
      buttons: [{ text: 'Sorry' }]
    });
    alert.present();
  }

  showSuccessAlert(message: string, source: string, callback: any = () => { }) {
    let alert = this.alertController.create({
      title: 'Success',
      subTitle: 'Source: ' + source,
      message: message,
      buttons: [{
        text: 'OK',
        handler: callback
      }]
    });
    alert.present();
  }

}