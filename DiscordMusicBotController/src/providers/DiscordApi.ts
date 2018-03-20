import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the DiscordApi provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DiscordApiProvider {

  private ApiEndPoint = 'https://discordapp.com/api/';

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello DiscordApi Provider');
  }

  post(url: string, body: any, noAuth = false): Promise<any> {
    let headerDict = {
      'Content-Type': 'application/json',
    }

    if (!noAuth) {
      return this.getApiTokenFromStorage()
        .then((result) => {
          headerDict['Authorization'] = result;
          const requestOptions = {
            headers: new Headers(headerDict),
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
        headers: new Headers(headerDict),
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
            headers: new Headers(headerDict),
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
        headers: new Headers(headerDict),
      };

      var urlGet = this.ApiEndPoint + url + this.BuildURLParametersString(body);
      console.log("Call get " + urlGet);
      return this.http.get(urlGet, requestOptions)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }

  private BuildURLParametersString(parameters: any): string {
    if (!parameters || parameters == null)
      return "";

    var string = "?";

    var separator = "";
    Object.keys(parameters).forEach(key => {
      string += separator + decodeURI(key) + encodeURI(parameters[key]);
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

  //async getApiToken(body: any): Promise<any> {
  //  let returnData = { success: null, message: "" };
  //  return this.post("oauth/token", body, true).then(
  //    data => {
  //      if (data) {
  //        this.saveApiToken(data.access_token);
  //        returnData.success = true;
  //      }
  //      else {
  //        returnData.success = true;
  //        returnData.message = "err 1";
  //      }
  //      return returnData;
  //    },
  //    error => {
  //      returnData.success = true;
  //      returnData.message = error;
  //      return returnData;
  //    }
  //  );
  //}

  //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
  private extractData(res: Response) {
    //Convert the response to JSON format
    let body = res.json();
    //Return the data (or nothing)
    return body || {};
  }

  //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
  private handleError(res: Response | any) {
    console.error('Entering handleError');
    console.dir(res.json());
    return Promise.reject(res.json().error || res.message || res);
  }

  public saveApiToken(token: string) {
    return this.storage.set("bearer", token);
  }

  private getApiTokenFromStorage() {
    return this.storage.get('bearer');
  }

  //public saveApiOauthInfo(oauthInfo: any) {
  //  this.storage.set("oauthClient_id", oauthInfo.client.id);
  //  this.storage.set("oauthClient_secret", oauthInfo.client_secret);
  //  this.storage.set("username", oauthInfo.user.email);
  //  this.storage.set("password", oauthInfo.password);
  //}

  //private getApiOauthInfo() {
  //  return {
  //    'oauthClient_id': this.storage.get('oauthClient_id'),
  //    'oauthClient_secret': this.storage.get('oauthClient_secret'),
  //    'username': this.storage.get('username'),
  //    'password': this.storage.get('password')
  //  }
  //}

  public clearStorage() {
    //this.storage.remove("oauthClient_id");
    //this.storage.remove("oauthClient_secret");
    //this.storage.remove("username");
    //this.storage.remove("password");
    this.storage.remove("bearer");
  }

}
