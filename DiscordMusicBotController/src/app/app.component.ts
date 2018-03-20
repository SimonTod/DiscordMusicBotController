import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AlertsProvider } from '../providers/Alerts';
import { DiscordApiProvider } from '../providers/DiscordApi';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = StartPage;

  constructor(
    platform: Platform,
    public discordApi: DiscordApiProvider,
    public alerts: AlertsProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.onInit();
    });
    platform.resume.subscribe(e => {
      this.onInit();
    })
  }

  onInit() {
    this.discordApi.checkUserLoggedIn().then((result) => {
      //this.navCtrl.push(LoginPage);
      //this.alerts.showErrorAlert(result ? "true": "false");
      this.rootPage = result ? HomePage : LoginPage;
    })
  }
}
