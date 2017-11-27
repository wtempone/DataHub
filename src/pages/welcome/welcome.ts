import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Api } from '../../providers/api';

import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { VersionProvider } from "../../providers/version";

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  private versionNumber: string;
  private fileTransfer: FileTransferObject;

  inAppBrowserOptions: {
    location:'no',
    clearcache: 'yes',
    enableviewportscale:'yes',
    closebuttoncaption:'Fechar'
  };
  
  constructor(public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private appVersion: AppVersion,
    private api: Api,
    private platform: Platform,
    private transfer: FileTransfer, 
    private file: File,
    public inAppBrowser : InAppBrowser,
    public version: VersionProvider
  ) { }

  ionViewDidLoad() {
    if (!this.platform.is('cordova')) {
      this.showLogin();    
      return;      
    }
    this.version.versionChanged().then(changed => changed.subscribe(value => {
      console.log(value);
      if (value) {
        this.version.showConfirmInstall();
      } else {
        this.showLogin();    
      }
    }));
  }

  showLogin() {
    let myModal = this.modalCtrl.create(LoginPage, {}, { enableBackdropDismiss:false, showBackdrop: false });
    myModal.present().then(() => {
      const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(0, index);
    });;
  }
}
