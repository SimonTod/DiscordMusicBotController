import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DiscordApiProvider } from '../../providers/DiscordApi';
import { AlertsProvider } from '../../providers/Alerts';

/*
  Generated class for the configure page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-configure',
  templateUrl: 'configure.html'
})
export class ConfigurePage {
  guildsLoading: boolean;
  guilds: Array<{ name: string, id: string, icon: string }>;
  selectedGuild: any;
  channelsLoading: boolean;
  channels: Array<{ name: string, id: string }>;
  selectedChannel: any;

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public discordApi: DiscordApiProvider,
      public storage: Storage,
      public alerts: AlertsProvider
    ) {
      
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad configurePage');

      this.initPage();
    }

    initPage() {
      this.guilds = [];
      this.selectedGuild = null;
      this.channels = [];
      this.selectedChannel = null;

      this.LoadGuilds();
    }

    LoadGuilds() {
      this.guildsLoading = true;
      this.discordApi.get('users/@me/guilds').then(
        data => {
          for (var i = 0; i < data.length; i++) {
            var icon = "https://cdn.discordapp.com/icons/" + data[i].id + "/" + data[i].icon + ".png";
            this.guilds.push({ name: data[i].name, id: data[i].id, icon: icon });
          }
          this.guildsLoading = false;
        },
        error => {
          this.guildsLoading = false;
        }
      );
    }

    SelectGuild(guild: any) {
      this.selectedGuild = guild;

      this.LoadChannels(guild);
    }

    LoadChannels(guild: any) {
      this.channelsLoading = true;
      this.discordApi.get('guilds/' + guild.id + '/channels').then(
        data => {
          for (var i = 0; i < data.length; i++) {
            if (data[i].type == 0) {
              this.channels.push({ name: data[i].name, id: data[i].id });
            }
          }
          this.channelsLoading = false;
        },
        error => {
          this.channelsLoading = false;
        }
      )
    }

    SelectChannel(channel: any) {
      this.selectedChannel = channel;

      this.SaveConfiguration();
    }

    SaveConfiguration() {
      let loader = this.loadingCtrl.create({
        content: "Saving Configuration"
      });
      loader.present();

      this.storage.set('guild', this.selectedGuild.id)
        .then((result) => {
          this.storage.set('channel', this.selectedChannel.id)
            .then((result) => {
              loader.dismiss();
              this.navCtrl.pop();
            })
            .catch((err) => {
              this.SaveConfigurationError(loader, err);
            });
        })
        .catch((err) => {
          this.SaveConfigurationError(loader, err);
        });
    }

    SaveConfigurationError(loader, err) {
      loader.dismiss();
      console.log('Error Configure' + err);
      this.alerts.showErrorAlert(err, "Configure");
    }

}
