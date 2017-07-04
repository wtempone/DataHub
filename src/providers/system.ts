import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api, URLs } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadingController } from "ionic-angular";

@Injectable()
export class System {
  _systems: any;

  constructor(public http: Http, public api: Api, public loadingCtrl: LoadingController) {
  }

  get(systemInfo: any) {
    let seq = this.api.get(URLs.DataHub, 'Sistema/GetByClientUserDevice', systemInfo).share();
    let loading = this.loadingCtrl.create({
      content: 'Obtendo lista de sistemas.'
    });
    loading.present();
    seq
      .map(res => res.json())
      .subscribe(res => {
        this._set(res);
        loading.dismiss();
      }, err => {
        console.error('ERROR', err);
        loading.dismiss();
      });

    return seq;
  }

  _set(resp) {
    this._systems = resp;
  }
}
