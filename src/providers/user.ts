import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api, URLs } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadingController } from "ionic-angular";

@Injectable()
export class User {
  _user: any;

  constructor(public http: Http, public api: Api, public loadingCtrl: LoadingController) {
  }

  login(accountInfo: any) {
    
    let seq = this.api.get(URLs.CentralLogin, 'CentralLogin/GetLogin', accountInfo).share();

    let loading = this.loadingCtrl.create({
      content: 'Realizando login do usuário.'
    });
    loading.present();
    seq
      .map(res => res.json())
      .subscribe(res => {
        loading.dismiss();
        this._loggedIn(res);
      }, err => {
        loading.dismiss();
        console.error('ERROR', err);
      });

    return seq;
  }

  logout() {
    this._user = null;
  }

  _loggedIn(resp) {
    this._user = resp.Usuario;
  }
}
