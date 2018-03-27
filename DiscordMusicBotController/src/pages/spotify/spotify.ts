import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable, OnInit, ElementRef, EventEmitter, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { DiscordApiProvider } from '../../providers/DiscordApi';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

export var SPOTIFY_CLIENT_ID = "9da65e0f4777402a88185915806a8a24"
export var SPOTIFY_CLIENT_SECRET = "9510e44710694f5bbf960ad7b8cf2cd6"
export var OAUTH_TOKEN_URL = 'https://accounts.spotify.com/api/token'
export var API_BASE = 'https://api.spotify.com/v1/'


class Token {
  access_token: string;
  token_type: string;

  constructor(obj?: any) {
    this.access_token = obj && obj.access_token || null;
    this.token_type = obj && obj.token_type || null;
  }
}

class SpotifyTrackSearchResult {
  id: string;
  name: string;
  type: string;
  artists: Array<string>;
  album: SpotifyAlbumSearchResult;
  uri: string;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.name = obj && obj.name || null;
    this.type = obj && obj.type || null;
    this.artists = obj && obj.artists || null;
    this.album = obj && obj.album || null;
    this.uri = obj && obj.uri || null;
  }
}

class SpotifyAlbumSearchResult {
  id: string;
  name: string;
  image: string;
  artists: string;
  uri: string;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.name = obj && obj.name || null;
    this.image = obj && obj.image || null;
    this.artists = obj && obj.artists || null;
    this.uri = obj && obj.uri || null;
  }
}

@Injectable()
export class SpotifyService {

  constructor (
    public http: Http,
    public storage: Storage,
    @Inject(SPOTIFY_CLIENT_ID) private clientId: string,
    @Inject(SPOTIFY_CLIENT_SECRET) private clientSecret: string,
    @Inject(OAUTH_TOKEN_URL) private oauthTokenUrl,
    @Inject(API_BASE) private apiBase
  ) {

  }

  searchTracks(query: string, newToken: boolean = false): Observable<SpotifyTrackSearchResult[]> {
    let params: string = [
      `q=${query}`,
      `type=track`
    ].join('&');
    let queryUrl: string = `${this.apiBase}search?${params}`;

    return Observable.fromPromise(this.getToken(newToken))
      .flatMap(token => this.http.get(queryUrl, { headers: new Headers({ 'Authorization': `${token.token_type} ${token.access_token}` }) }))
      .map((response: Response) => {
        return (<any>response.json()).tracks.items.map(item => {
          var artists = new Array<string>();
          for (var i = 0; i < item.artists.length; i++) {
            artists.push(item.artists[i].name);
          }
          var album = new SpotifyAlbumSearchResult({
            id: item.album.id,
            name: item.album.name,
            image: item.album.images[0].url,
          })
          return new SpotifyTrackSearchResult({
            id: item.id,
            name: item.name,
            type: item.type,
            uri: item.uri,
            artists: artists,
            album: album
          });
        });
      })
      .catch((res: Response | any) => {
        var resJson = res.json();
        if (resJson.error.status == 400 || resJson.error.status == 401) {
          return this.searchTracks(query, true);
        }
      });
  }

  searchAlbums(query: string, newToken: boolean = false): Observable<SpotifyAlbumSearchResult[]> {
    let params: string = [
      `q=${query}`,
      `type=album`
    ].join('&');
    let queryUrl: string = `${this.apiBase}search?${params}`;

    return Observable.fromPromise(this.getToken(newToken))
      .flatMap(token => this.http.get(queryUrl, { headers: new Headers({ 'Authorization': `${token.token_type} ${token.access_token}` }) }))
      .map((response: Response) => {
        return (<any>response.json()).albums.items.map(item => {
          var artists = new Array<string>();
          for (var i = 0; i < item.artists.length; i++) {
            artists.push(item.artists[i].name);
          }
          return new SpotifyAlbumSearchResult({
            id: item.id,
            name: item.name,
            image: item.images[0].url,
            artists: artists.join(' - '),
            uri: item.uri
          });
        });
      })
      .catch((res: Response | any) => {
        var resJson = res.json();
        if (resJson.error.status == 400 || resJson.error.status == 401) {
          return this.searchAlbums(query, true);
        }
      });
  }

  getToken(newToken: boolean): Promise<Token> {
    if (newToken) {
      let params: string = "grant_type=client_credentials";
      let headers = new Headers({
        'Authorization': "Basic " + btoa(this.clientId + ":" + this.clientSecret),
        'Content-Type': "application/x-www-form-urlencoded"
      });

      return this.http.post(this.oauthTokenUrl, params, { headers: headers })
        .toPromise()
        .then((res: Response) => {
          let body = res.json();
          var token = new Token({ access_token: body.access_token, token_type: body.token_type });
          this.saveToken(token);
          return token || new Token();
        })
        .catch((res: Response | any) => {
          return Promise.reject(res.json().error || res.message || res);
        });
    }
    else {
      return this.getTokenFromStorage();
    }
  }

  saveToken(token: Token) {
    this.storage.set('spotifyToken_accessToken', token.access_token);
    this.storage.set('spotifyToken_tokenType', token.token_type);
  }

  getTokenFromStorage(): Promise<Token> {
    return this.storage.get('spotifyToken_accessToken')
      .then((spotifyToken_accessToken) => {
        return this.storage.get('spotifyToken_tokenType')
          .then((spotifyToken_tokenType) => {
            return new Token({ access_token: spotifyToken_accessToken, token_type: spotifyToken_tokenType });
          });
      });
  }
}

export var spotifyServiceInjectables: Array<any> = [
  { provide: SpotifyService, useClass: SpotifyService },
  { provide: SPOTIFY_CLIENT_ID, useValue: SPOTIFY_CLIENT_ID },
  { provide: SPOTIFY_CLIENT_SECRET, useValue: SPOTIFY_CLIENT_SECRET },
  { provide: OAUTH_TOKEN_URL, useValue: OAUTH_TOKEN_URL },
  { provide: API_BASE, useValue: API_BASE }
];

@Component({
  outputs: ['loading', 'tracksResults', 'albumsResults'],
  selector: 'spotify-search-box',
  template: `
   <p>Enter something in the field and see the asynchronous results!</p>
   <ion-searchbar type="text" placeholder="Search"></ion-searchbar>
 `
})

export class SpotifySearchBox implements OnInit {
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  tracksResults: EventEmitter<SpotifyTrackSearchResult[]> = new EventEmitter<SpotifyTrackSearchResult[]>();
  albumsResults: EventEmitter<SpotifyAlbumSearchResult[]> = new EventEmitter<SpotifyAlbumSearchResult[]>();

  constructor(public spotify: SpotifyService,
    private el: ElementRef) {
  }

  ngOnInit(): void {
    //tracks
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .filter((text: string) => text.length > 1)
      .debounceTime(250)
      .do(() => this.loading.next(true))
      .map((query: string) => this.spotify.searchTracks(query))
      .switch()
      .subscribe(
      (tracksResults: SpotifyTrackSearchResult[]) => {
        this.loading.next(false);
        this.tracksResults.next(tracksResults);
      },
      (err: any) => {
        console.log(err);
        this.loading.next(false);
      },
      () => {
        this.loading.next(false);
      }
      );

    //albums
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .filter((text: string) => text.length > 1)
      .debounceTime(250)
      .do(() => this.loading.next(true))
      .map((query: string) => this.spotify.searchAlbums(query))
      .switch()
      .subscribe(
      (albumsResults: SpotifyAlbumSearchResult[]) => {
        this.loading.next(false);
        this.albumsResults.next(albumsResults);
      },
      (err: any) => {
        console.log(err);
        this.loading.next(false);
      },
      () => {
        this.loading.next(false);
      }
      )
  }
}

@Component({
  inputs: ['result'],
  selector: 'spotify-tracks-search-result',
  template: `
  <ion-item>
    <ion-thumbnail item-start>
      <img src="{{result.album.image}}">
    </ion-thumbnail>
    <div class="info">
      <h2>{{result.name}}</h2>
      <p>{{result.artists}}</p>
      <p>Album: {{result.album.name}}</p>
    </div>
    <button ion-button icon-left clear item-end (click)="Play(result.uri)">
      <ion-icon name="play"></ion-icon>
      <div>Play</div>
    </button>
  </ion-item>
 `
})

export class SpotifyTracksSearchResultComponent {
  tracksResult: SpotifyTrackSearchResult;

  constructor(public navCtrl: NavController, public discordApi: DiscordApiProvider) {

  }

  Play(query) {
    this.discordApi.sendCommand(this.discordApi.Commands.play, query);
  }
}

@Component({
  inputs: ['result'],
  selector: 'spotify-albums-search-result',
  template: `
  <ion-item>
    <ion-thumbnail item-start>
      <img src="{{result.image}}">
    </ion-thumbnail>
    <div class="info">
      <h2>{{result.name}}</h2>
      <p>{{result.artists}}</p>
    </div>
    <button ion-button icon-left clear item-end (click)="Play(result.uri)">
      <ion-icon name="play"></ion-icon>
      <div>Play</div>
    </button>
  </ion-item>
 `
})

export class SpotifyAlbumsSearchResultComponent {
  albumsResult: SpotifyAlbumSearchResult;

  constructor(public navCtrl: NavController, public discordApi: DiscordApiProvider) {

  }

  Play(query) {
    this.discordApi.sendCommand(this.discordApi.Commands.play, query);
  }
}

@Component({
    selector: 'page-spotify',
    templateUrl: 'spotify.html'
})
export class SpotifyPage {
  type = "";
  tracksResults: SpotifyTrackSearchResult[];
  albumsResults: SpotifyAlbumSearchResult[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type = 'tracks';
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SpotifyPage');
    }

    updateTracksResults(results: SpotifyTrackSearchResult[]): void {
      this.tracksResults = results;
    }

    updateAlbumsResults(results: SpotifyAlbumSearchResult[]): void {
      this.albumsResults = results;
    }
}
