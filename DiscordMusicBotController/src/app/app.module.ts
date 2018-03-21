import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, Platform } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ConfigurationPage } from '../pages/configuration/configuration';
import { ConfigurePage } from '../pages/configure/configure';
import { DiscordApiProvider } from '../providers/DiscordApi';
import { AlertsProvider } from '../providers/Alerts';

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    HomePage,
    LoginPage,
    ConfigurationPage,
    ConfigurePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    HomePage,
    LoginPage,
    ConfigurationPage,
    ConfigurePage
  ],
  providers: [DiscordApiProvider, AlertsProvider, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
