import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';


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
