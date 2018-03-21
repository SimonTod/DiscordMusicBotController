import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ConfigurationPage } from '../pages/configuration/configuration';

import { AlertsProvider } from '../providers/Alerts';
import { DiscordApiProvider } from '../providers/DiscordApi';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = StartPage;

  pages: Array<{title: string, component: any}>;

  constructor(
    platform: Platform,
    public discordApi: DiscordApiProvider,
    public alerts: AlertsProvider,
    private menu: MenuController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Configuration', component: ConfigurationPage }
      ]

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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.discordApi.clearStorage();
    this.menu.close();
    this.nav.setRoot(LoginPage);
  }
}
