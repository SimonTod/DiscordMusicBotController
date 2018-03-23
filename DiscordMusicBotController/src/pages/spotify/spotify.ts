import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable, OnInit, ElementRef, EventEmitter, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { DiscordApiProvider } from '../../providers/DiscordApi';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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

class SpotifySearchResult {
  id: string;
  name: string;
  type: string;
  artists: Array<string>;
  album: Album;
  uri: string;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.name = obj && obj.name || null;
    this.type = obj && obj.type || null;
    this.artists = obj && obj.artists || null;
    this.album = obj && obj.album || null;
    this.uri = obj && obj.uri || null

  }
}

class Album {
  id: string;
  name: string;
  image: string;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.name = obj && obj.name || null;
    this.image = obj && obj.image || null;
  }
}

@Injectable()
export class SpotifyService {

  constructor (
    public http: Http,
    public tokenService: SpotifyTokenService,
    public storage: Storage,
    @Inject(API_BASE) private apiBase
  ) {

  }

  search(query: string): Observable<SpotifySearchResult[]> {
    let params: string = [
      `q=${query}`,
      `type=track`
    ].join('&');
    let queryUrl: string = `${this.apiBase}search?${params}`;

    //let headers = new Headers({
    //  'Authorization': `${token.token_type} ${token.access_token}`
    //});

    //return this.http.get(queryUrl, { headers: headers })
    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json()).track.items.map(item => {
          var artists: Array<string>;
          for (var i = 0; i < item.artists.length; i++) {
            artists.push(item.artists[i].name);
          }
          var album = new Album({
            id: item.album.id,
            name: item.album.name,
            image: item.album.images[0].url
          })
          return new SpotifySearchResult({
            id: item.id,
            name: item.name,
            type: item.type,
            uri: item.uri,
            artists: artists,
            album: album
          });
        });
      });
    
  }
}

@Injectable()
export class SpotifyTokenService {

  constructor(
    public http: Http,
    @Inject(SPOTIFY_CLIENT_ID) private clientId: string,
    @Inject(SPOTIFY_CLIENT_SECRET) private clientSecret: string,
    @Inject(OAUTH_TOKEN_URL) private oauthTokenUrl,
    @Inject(API_BASE) private apiBase
  ) {

  }

  //getToken() {
  //  let params: string = "grant_type=client_credentials";
  //  let headers = new Headers({
  //    'Authorization': "Basic " + btoa(this.clientId + ":" + this.clientSecret),
  //    'Content-Type': "application/x-www-form-urlencoded"
  //  });

  //  return this.http.post(this.oauthTokenUrl, params, { headers: headers })
  //    .map((response: Response) => {
  //      return (<any>response.json()).map(item => {
  //        return new Token({
  //          access_token: item.access_token,
  //          token_type: item.token_type
  //        });
  //      });
  //    });
  //}

  getToken(): Promise<Token> {
    let params: string = "grant_type=client_credentials";
    let headers = new Headers({
      'Authorization': "Basic " + btoa(this.clientId + ":" + this.clientSecret),
      'Content-Type': "application/x-www-form-urlencoded"
    });

    return this.http.post(this.oauthTokenUrl, params, { headers: headers })
      .toPromise()
      .then((res: Response) => {
        let body = res.json();
        var token = new Token({ access_token: body.access_token, token_type: body.token_type })
        return token || new Token();
      })
      .catch((res: Response | any) => {
        return Promise.reject(res.json().error || res.message || res);
      });
  }

}

export var spotifyServiceInjectables: Array<any> = [
  { provide: SpotifyService, useClass: SpotifyService },
  //{ provide: SpotifyTokenService, useClass: SpotifyTokenService },
  { provide: SPOTIFY_CLIENT_ID, useValue: SPOTIFY_CLIENT_ID },
  { provide: SPOTIFY_CLIENT_SECRET, useValue: SPOTIFY_CLIENT_SECRET },
  { provide: OAUTH_TOKEN_URL, useValue: OAUTH_TOKEN_URL },
  { provide: API_BASE, useValue: API_BASE }
];

@Component({
  outputs: ['loading', 'results'],
  selector: 'spotify-search-box',
  template: `
   <p>Enter something in the field and see the asynchronous results!</p>
   <input type="text" class="form-control" placeholder="Search" autofocus>
 `
})

export class SpotifySearchBox implements OnInit {
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  results: EventEmitter<SpotifySearchResult[]> = new EventEmitter<SpotifySearchResult[]>();

  constructor(public spotify: SpotifyService,
    private el: ElementRef) {
  }

  ngOnInit(): void {
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .filter((text: string) => text.length > 1)
      .debounceTime(250)
      .do(() => this.loading.next(true))
      .map((query: string) => this.spotify.search(query))
      .switch()
      .subscribe(
      (results: SpotifySearchResult[]) => {
        this.loading.next(false);
        this.results.next(results);
      },
      (err: any) => {
        console.log(err);
        this.loading.next(false);
      },
      () => {
        this.loading.next(false);
      }
      );
  }
}

@Component({
  inputs: ['result'],
  selector: 'spotify-search-result',
  template: `
  <ion-card>
    <ion-item>
      <ion-avatar item-start>
      <img src="{{result.album.image}}">
    </ion-avatar>
    <h2>{{result.name}}</h2>
    <!--<p>{{result.artists}}</p>-->
    </ion-item>
    <img src="{{result.album.image}}">
    <ion-card-content>
      <p>Album: {{result.album.name}}</p>
    </ion-card-content>
    <ion-row>
      <ion-col>
        <button ion-button icon-left clear small (click)="Play(result.uri)">
          <ion-icon name="play"></ion-icon>
          <div>Play</div>
        </button>
      </ion-col>
    </ion-row>
  </ion-card>
 `
})

export class SpotifySearchResultComponent {
  result: SpotifySearchResult;

  constructor(public navCtrl: NavController, public discordApi: DiscordApiProvider) {

  }

  Play(query) {
    this.discordApi.sendCommand(this.discordApi.Commands.play, query);
    this.navCtrl.pop();
  }
}

@Component({
    selector: 'page-spotify',
    templateUrl: 'spotify.html'
})
export class SpotifyPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SpotifyPage');
    }

    results: SpotifySearchResult[];

    updateResults(results: SpotifySearchResult[]): void {
      this.results = results;
    }
}
