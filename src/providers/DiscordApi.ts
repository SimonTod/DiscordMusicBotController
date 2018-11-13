import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DiscordApiProvider {
    
    Commands = {
        play: "play",
        pause: "pause",
        resume: "resume",
        next: "skip"
    }
    
    private ApiEndPoint = 'https://discordapp.com/api/';
    
    
    constructor(public http: HttpClient, public storage: Storage, public loadingCtrl: LoadingController) {
        console.log('Hello HttpRequests Provider');
    }
    
    
    post(url: string, body: any, noAuth = false): Promise<any> {
        let headerDict = {}
        headerDict["Content-Type"] =  'application/json';
        
        if (!noAuth) {
            return this.getApiTokenFromStorage()
            .then((result) => {
                headerDict['Authorization'] = result;
                const requestOptions = {
                    headers: new HttpHeaders(headerDict),
                };
                
                var urlPost = this.ApiEndPoint + url;
                console.log("Call post " + urlPost);
                return this.http.post(urlPost, body, requestOptions)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
            })
            .catch((err) => {
                console.log("err");
                throw err;
            });
        }
        else {
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            
            var urlPost = this.ApiEndPoint + url;
            console.log("Call post " + urlPost);
            return this.http.post(urlPost, body, requestOptions)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
        }
    }
    
    get(url: string, body: any = null, noAuth = false): Promise<any> {
        let headerDict = {
            'Content-Type': 'application/json',
        }
        
        if (!noAuth) {
            return this.getApiTokenFromStorage()
            .then((result) => {
                headerDict['Authorization'] = result;
                
                const requestOptions = {
                    headers: new HttpHeaders(headerDict),
                };
                
                var urlGet = this.ApiEndPoint + url + this.BuildURLParametersString(body);
                console.log("Call get " + urlGet);
                return this.http.get(urlGet, requestOptions)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
        }
        else {
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            
            var urlGet = this.ApiEndPoint + url + this.BuildURLParametersString(body);
            console.log("Call get " + urlGet);
            return this.http.get(urlGet, requestOptions)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
        }
    }
    
    async sendCommand(type: string, url?: string) {
        let loader = this.loadingCtrl.create({
            content: "Sending command"
        });
        loader.present();
        
        var command = "";
        switch (type) {
            case this.Commands.play:
            if (url == undefined || url == null) {
                loader.dismiss();
                throw new Error("url missing");
            }
            command = "!play " + url;
            break;
            default:
            command = "!" + type.toString();
            break;
        }
        
        var body = { content: command };
        
        this.storage.get('channel')
        .then((channelId) => {
            this.post('channels/' + channelId + '/messages', body).then((result) => {
                loader.dismiss();
            });
        })
        .catch(err => { loader.dismiss(); throw err; });
    }
    
    public BuildURLParametersString(parameters: any): string {
        if (!parameters || parameters == null || Object.keys(parameters).length === 0)
        return "";
        
        var string = "?";
        
        var separator = "";
        Object.keys(parameters).forEach(key => {
            string += separator + decodeURI(key) + "=" + encodeURI(parameters[key]);
            separator = "&";
        });
        
        return string;
    }
    
    async checkUserLoggedIn() {
        return this.getApiTokenFromStorage()
        .then((result) => {
            if (result.length > 0) {
                return this.get("users/@me").then(
                    data => {
                        return true;
                    },
                    error => {
                        return false;
                    }).catch((err) => { return false; });
                }
                else {
                    return false;
                }
            })
            .catch((err) => {
                return false;
            });
        }
        
        private extractData(res: Response) {
            return res || {};
        }
        
        private handleError(res: Response | any) {
            console.error('Entering handleError');
            console.dir(res);
            return Promise.reject(res.error || res.message || res);
        }
        
        public saveApiToken(token: string) {
            return this.storage.set("bearer", token);
        }
        
        private getApiTokenFromStorage() {
            return this.storage.get('bearer');
        }
        
        public clearStorage() {
            this.storage.remove("bearer");
        }
        
    }