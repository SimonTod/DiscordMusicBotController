import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

/*
  Generated class for the start page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})
export class StartPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad startPage');
    }

    ionViewDidEnter() {
      this.menu.swipeEnable(false);
    }

    ionViewWillLeave() {
      this.menu.swipeEnable(true);
    }

}
