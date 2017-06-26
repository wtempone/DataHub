import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api, URLs } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadingController } from "ionic-angular";

@Injectable()
export class Client {
  _clients: any;

  constructor(public http: Http, public api: Api, public loadingCtrl: LoadingController) {
  }

  get(clientInfo: any) {
    let seq = this.api.get(URLs.DataHub, 'Cliente/GetByUser', clientInfo).share();

    let loading = this.loadingCtrl.create({
      content: 'Carregando menu de clientes.'
    });
    loading.present();

    seq
      .map(res => res.json())
      .subscribe(res => {
        this._set(res);
        loading.dismiss();       
      }, err => {
        loading.dismiss();       
        console.error('ERROR', err);
      });

    return seq;
  }

  _set(resp) {
    this._clients = resp;
  }
}
