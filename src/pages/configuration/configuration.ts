import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConfigurePage } from '../configure/configure';
import { DiscordApiProvider } from '../../providers/DiscordApi';

/*
  Generated class for the configuration page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-configuration',
    templateUrl: 'configuration.html'
})
export class ConfigurationPage {
  guild: any;
  channel: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public discordApi: DiscordApiProvider
  ) {

  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad configurationPage');
    }

    ionViewWillEnter() {
      this.initPage();
    }

    initPage() {
      this.storage.get('guild').then((guildId) => {
        this.storage.get('channel').then((channelId) => {
          this.discordApi.get('guilds/' + guildId).then(
            data => {
              var icon = "https://cdn.discordapp.com/icons/" + data.id + "/" + data.icon + ".png";
              this.guild = { name: data.name, icon: icon, id: data.id };
            },
            error => {

            }
          );
          this.discordApi.get('channels/' + channelId).then(
            data => {
              this.channel = { name: data.name, id: data.id };
            },
            error => {

            }
          );
        })
      })
    }

    configure() {
      this.navCtrl.push(ConfigurePage);
    }

}
