import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Api } from '../../providers/api';

import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    public inAppBrowser : InAppBrowser    
  ) { }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then(versaoLocal => {
        console.log('versaoLocal: '+versaoLocal);
        this.api.version().map(server => server.json())
        .subscribe(server => {
          console.log('server.versao: '+server.versao);
          if (server.versao != versaoLocal){
            this.showConfirmInstall(server.versao);
          } else {
            this.showLogin();    
          }
        }, err => {
          console.error('ERROR', err);
        });
      });    
    });
  }

  showConfirmInstall(versao) {
    let confirm = this.alertCtrl.create({
      title: 'DataHub',
      message: 'Uma nova versão ('+versao+') do aplicativo está disponível para seu dispositivo. Deseja atualizar agora?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelamento selecionado');
            this.showLogin();
          }
        },
        {
          text: 'Atualizar',
          handler: () => {
            console.log(this.platform);            
            this.updateApp();
          }
        }
      ]
    });
    confirm.present();
  }  


  updateApp() {
    console.log(this.platform);
    console.log(this.platform);
    if (this.platform.is('android')) {
      this.installAndroid();
    }
    if (this.platform.is('ios')) {
      this.installIOS();
      //window.open('itms-services://?action=download-manifest&url=https://forecastappdev.wmccann.com/DataHubApp/manifest.plist');
      
    }
    console.log('Atualizacao Selecionada');
  }

  
  installAndroid() {
    this.fileTransfer = this.transfer.create();
    const url = 'https://forecastappdev.wmccann.com/DataHubApp/DataHub.apk';
    this.fileTransfer.download(url, this.file.externalRootDirectory + 'download/DataHub.apk').then((entry) => {
      
      console.log(entry.toURL());

      const options = {
        action: (<any>window).plugins.intentShim.ACTION_VIEW,
        url: entry.toURL(),
        type: 'application/vnd.android.package-archive'
      };

      (<any>window).plugins.intentShim.startActivity(options,
        function() {},
        function() {alert('Falha ao abrir URL via Android Intent')}
      );    

    }, (error) => {
      let confirm = this.alertCtrl.create({
        title: 'DataHub',
        message: 'Não foi possível baixar a nova versão. Habilite o armazenamento de dados para o aplicativo. Para isso acesse no seu aparelho: "Configurar > Aplicativos > DataHub > Permissões" e habilite a permissão de "Armazenamento".',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.showLogin();    
            }
          }
        ]
      });
      confirm.present();      
    });
  }


  installIOS() {
      this.inAppBrowser.create('itms-services://?action=download-manifest&url=https://forecastappdev.wmccann.com/DataHubApp/manifest.plist', "_system", this.inAppBrowserOptions);
  }
  
  showLogin() {
    let myModal = this.modalCtrl.create(LoginPage, {}, { enableBackdropDismiss:false });
    myModal.present();
  }
}
