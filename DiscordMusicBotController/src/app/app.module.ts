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
import { YoutubePage, youTubeServiceInjectables, YoutubeSearchResultComponent, YoutubeSearchBox } from '../pages/youtube/youtube';
import { SpotifyPage, spotifyServiceInjectables, SpotifySearchResultComponent, SpotifySearchBox } from '../pages/spotify/spotify';

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    HomePage,
    LoginPage,
    ConfigurationPage,
    ConfigurePage,
    YoutubePage,
    YoutubeSearchResultComponent,
    YoutubeSearchBox,
    SpotifyPage,
    SpotifySearchResultComponent,
    SpotifySearchBox
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
    ConfigurePage,
    YoutubePage,
    YoutubeSearchResultComponent,
    YoutubeSearchBox,
    SpotifyPage,
    SpotifySearchResultComponent,
    SpotifySearchBox
  ],
  providers: [DiscordApiProvider, AlertsProvider, youTubeServiceInjectables, spotifyServiceInjectables, { provide: ErrorHandler, useClass: IonicErrorHandler }],
  exports: [
    YoutubePage, SpotifyPage
  ]
})
export class AppModule { }
