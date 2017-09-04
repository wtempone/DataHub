import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

export const URLs =  {
  //Localhost    
  //SCLSite: 'http://localhost:6626',
  //CentralLogin: "http://localhost:56018",
  //DataHub: "http://localhost:60869",
  //ServerVersion: "https://forecastappdev.wmccann.com/DataHubApp/versao.json"
  
  SCLSite: null,
  CentralLogin: "http://centralloginservices.dev.wmccann.com",
  DataHub: "http://profileservice.dev.wmccann.com",
  ServerVersion: "https://forecastappdev.wmccann.com/DataHubApp/versao.json"

  //SCLSite: null,
  //CentralLogin: "http://centralloginservices.qas.wmccann.com",
  //DataHub: "http://profileservice.qas.wmccann.com",
  //ServerVersion: "https://forecastappdev.wmccann.com/DataHubApp/versao.json"
  
}

@Injectable()
export class Api {

  constructor(public http: Http) {
  }

  get(url: string, endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }

      options.search = !options.search && p || options.search;
    }

    return this.http.get(url + '/api/' + endpoint, options);
  }

  post(url: string, endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(url + '/api/' + endpoint, body, options);
  }

  put(url: string, endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(url + '/api/' + endpoint, body, options);
  }

  delete(url: string, endpoint: string, options?: RequestOptions) {
    return this.http.delete(url + '/api/' + endpoint, options);
  }

  patch(url: string, endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(url + '/api/' + endpoint, body, options);
  }

  version() {
    return this.http.get(URLs.ServerVersion);
  }
}
