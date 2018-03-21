import { Component } from '@angular/core';
import { DiscordApiProvider } from '../../providers/DiscordApi';
import { AlertsProvider } from '../../providers/Alerts';
import { LoadingController, NavController, Platform, NavParams, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

/*
  Generated class for the login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginEntry = {};

  constructor(
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public discordApi: DiscordApiProvider,
    public alerts: AlertsProvider,
    private menu: MenuController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad loginPage');
  }

  loginForm() {
    let loader = this.loadingCtrl.create({
      content: "Connection"
    });
    //Show the loading indicator
    loader.present();

    this.discordApi.post("v6/auth/login", this.loginEntry, true).then(
      data => {
        if (data) {
          this.discordApi.saveApiToken(data.token)
            .then((result) => {
              loader.dismiss();
              this.navCtrl.setRoot(HomePage, { justLoggedIn: true });
            })
            .catch((err) => {
              loader.dismiss();
              console.log('Error Log in' + err);
              this.alerts.showErrorAlert(err, "Log In");
            });
          
        } else {
          loader.dismiss();
          //This really should never happen
          console.error('Error Log in: no data');
        }
      },
      error => {
        //Hide the loading indicator
        loader.dismiss();
        console.error('Error Log in');
        console.dir(error);
        this.alerts.showErrorAlert(error, "Log In");
      }
    );
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

}
