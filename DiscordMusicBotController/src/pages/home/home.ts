import { Component } from '@angular/core';
import { DiscordApiProvider } from '../../providers/DiscordApi';
import { AlertsProvider } from '../../providers/Alerts';

import { LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { EdensPage } from '../edens/edens';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public justLoggedIn = false;

  constructor(
    public loadingCtrl: LoadingController,
    public nav: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public discordApi: DiscordApiProvider,
    public alerts: AlertsProvider
  ) {
    this.justLoggedIn = navParams.get("justLoggedIn");
  }

  onLink(url: string) {
    window.open(url);
  }

  ionViewDidLoad() {
    //Once the main view loads
    //and after the platform is ready...
    //this.platform.ready().then(() => {
    //  //Setup a resume event listener
    //  document.addEventListener('resume', () => {
        
    //  });
      
    //});
    this.Loaded();
  }

  Loaded() {
    if (this.justLoggedIn) {
      this.discordApi.get("users/@me").then(
        data => {
          this.alerts.showSuccessAlert("Bienvenu " + data.username, "Home");
        },
        error => {
          this.alerts.showErrorAlert(error, "Home");
        }
      ).catch((err) => {
        this.alerts.showErrorAlert(err, "Home");
      });
    }
  }

}
