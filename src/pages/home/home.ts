import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, Platform } from 'ionic-angular';
import { DiscordApiProvider } from '../../providers/DiscordApi';
import { AlertsProvider } from '../../providers/Alerts';

import { YoutubePage } from '../youtube/youtube';
import { SpotifyPage } from '../spotify/spotify';

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

  ionViewDidLoad() {
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

  Pause() {
    this.discordApi.sendCommand(this.discordApi.Commands.pause);
  }

  Resume() {
    this.discordApi.sendCommand(this.discordApi.Commands.resume);
  }

  Next() {
    this.discordApi.sendCommand(this.discordApi.Commands.next);
  }

  Youtube() {
    this.nav.push(YoutubePage);
  }

  Spotify() {
    this.nav.push(SpotifyPage);
  }

}
