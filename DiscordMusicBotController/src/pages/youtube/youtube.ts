import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable, OnInit, ElementRef, EventEmitter, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { DiscordApiProvider } from '../../providers/DiscordApi';

export var YOUTUBE_API_KEY: string = 'AIzaSyBcLc8vplFhLYnCpU1v4xS4EgdmHuEf8Es';
export var YOUTUBE_API_URL: string = 'https://www.googleapis.com/youtube/v3/search';

class YoutubeSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: Date;
  videoUrl: string;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.title = obj && obj.title || null;
    this.description = obj && obj.description || null;
    this.thumbnailUrl = obj && obj.thumbnailUrl || null;
    this.channelTitle = obj && obj.channelTitle || null;
    this.publishedAt = obj && obj.publishedAt || null;
    this.videoUrl = obj && obj.videoUrl ||
      `https://www.youtube.com/watch?v=${this.id}`;
  }
}

@Injectable()
export class YouTubeService {

  constructor(public http: Http,
    @Inject(YOUTUBE_API_KEY) private apiKey: string,
    @Inject(YOUTUBE_API_URL) private apiUrl: string) {
  }

  search(query: string): Observable<YoutubeSearchResult[]> {
    let params: string = [
      `q=${query}`,
      `key=${this.apiKey}`,
      `part=snippet`,
      `type=video`,
      `maxResults=10`
    ].join('&');
    let queryUrl: string = `${this.apiUrl}?${params}`;
    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json()).items.map(item => {
          return new YoutubeSearchResult({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt
          });
        });
      });
  }
}

export var youTubeServiceInjectables: Array<any> = [
  { provide: YouTubeService, useClass: YouTubeService },
  { provide: YOUTUBE_API_KEY, useValue: YOUTUBE_API_KEY },
  { provide: YOUTUBE_API_URL, useValue: YOUTUBE_API_URL }
];

@Component({
  outputs: ['loading', 'results'],
  selector: 'youtube-search-box',
  template: `
   <p>Enter something in the field and see the asynchronous results!</p>
   <ion-searchbar type="text" placeholder="Search"></ion-searchbar>
 `
})

export class YoutubeSearchBox implements OnInit {
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  results: EventEmitter<YoutubeSearchResult[]> = new EventEmitter<YoutubeSearchResult[]>();

  constructor(public youtube: YouTubeService,
    private el: ElementRef) {
  }

  ngOnInit(): void {
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .filter((text: string) => text.length > 1)
      .debounceTime(250)
      .do(() => this.loading.next(true))
      .map((query: string) => this.youtube.search(query))
      .switch()
      .subscribe(
      (results: YoutubeSearchResult[]) => {
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
  selector: 'youtube-search-result',
  template: `
  <ion-item>
    <ion-thumbnail item-start>
      <img src="{{result.thumbnailUrl}}">
    </ion-thumbnail>
    <div class="info">
      <h2>{{result.title}}</h2>
      <p>{{result.channelTitle}}</p>
    </div>
    <button ion-button icon-left clear item-end (click)="Play(result.videoUrl)">
      <ion-icon name="play"></ion-icon>
      <div>Play</div>
    </button>
  </ion-item>
 `
})

export class YoutubeSearchResultComponent {
  result: YoutubeSearchResult;

  constructor(public navCtrl: NavController, public discordApi: DiscordApiProvider) {

  }

  Play(videoUrl) {
    this.discordApi.sendCommand(this.discordApi.Commands.play, videoUrl);
    this.navCtrl.pop();
  }
}

@Component({
  selector: 'page-youtube',
  templateUrl: 'youtube.html'
})

export class YoutubePage {
  type = "";
  results: YoutubeSearchResult[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type = 'videos';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoutubePage');
  }


  updateResults(results: YoutubeSearchResult[]): void {
    this.results = results;
  }
}
