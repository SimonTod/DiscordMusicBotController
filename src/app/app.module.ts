import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';


import { MyApp } from './app.component';
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ConfigurationPage } from '../pages/configuration/configuration';
import { ConfigurePage } from '../pages/configure/configure';
import { YoutubePage, YoutubeChannelPage, youTubeServiceInjectables, YoutubeSearchResultComponent, YoutubeChannelSearchResultComponent, YoutubeSearchBox } from '../pages/youtube/youtube';
import { SpotifyPage, spotifyServiceInjectables, SpotifyTracksSearchResultComponent, SpotifyAlbumsSearchResultComponent, SpotifySearchBox } from '../pages/spotify/spotify';

import { DiscordApiProvider } from '../providers/DiscordApi';
import { AlertsProvider } from '../providers/Alerts';

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    HomePage,
    LoginPage,
    ConfigurationPage,
    ConfigurePage,
    YoutubePage,
    YoutubeChannelPage,
    YoutubeSearchResultComponent,
    YoutubeChannelSearchResultComponent,
    YoutubeSearchBox,
    SpotifyPage,
    SpotifyTracksSearchResultComponent,
    SpotifyAlbumsSearchResultComponent,
    SpotifySearchBox
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
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
    YoutubeChannelPage,
    YoutubeSearchResultComponent,
    YoutubeChannelSearchResultComponent,
    YoutubeSearchBox,
    SpotifyPage,
    SpotifyTracksSearchResultComponent,
    SpotifyAlbumsSearchResultComponent,
    SpotifySearchBox
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DiscordApiProvider, 
    AlertsProvider, 
    youTubeServiceInjectables, 
    spotifyServiceInjectables
  ],
  exports: [
    YoutubePage, 
    YoutubeChannelPage, 
    SpotifyPage
  ]
})
export class AppModule {}
