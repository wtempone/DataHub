import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api, URLs } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Ticket {
  _ticket: any;

  constructor(public http: Http, public api: Api) {
  }

  get(ticketInfo: any) {
    let seq = this.api.get(URLs.DataHub, 'Sistema/GetTicket', ticketInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        this._set(res);
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  _set(resp) {
    this._ticket = resp;
  }
}
