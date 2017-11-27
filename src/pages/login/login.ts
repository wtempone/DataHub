import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

//import { MainPage } from '../../pages/pages';

import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { SelectClientPage } from "../menu-select-client/select-client";
//import { SelectSystemPage } from "../select-system/select-system";
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular/platform/platform';
import { URLs } from '../../providers/api';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  ambiente;

  account: { login: string, senha: string } = {
    login: '',
    senha: ''
  };

  // Our translated text strings
  private loginErrorString: string;
  public versionNumber: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private appVersion: AppVersion,
    private platform: Platform
  ) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    if (this.platform.is('cordova'))
      this.appVersion.getVersionNumber().then(version => this.versionNumber = version);

      if (URLs.Ambiente)
        this.ambiente = URLs.Ambiente;
  }

  presentError() {
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      if (resp.statusText = 'OK'){
        if (resp.json().ModelErros.length == 0) {
          this.navCtrl.setRoot(SelectClientPage);
        } else {
          this.presentError();
        }
      } else {
        this.presentError();        
      }
    }, (err) => {
      this.presentError();
    });
  }
}
