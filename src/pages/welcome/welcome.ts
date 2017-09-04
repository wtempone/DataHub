import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Api } from '../../providers/api';

import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  private versionNumber: string;
  private fileTransfer: FileTransferObject = this.transfer.create();
  
  constructor(public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private appVersion: AppVersion,
    private api: Api,
    private platform: Platform,
    private transfer: FileTransfer, 
    private file: File
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
      console.log('plataforma android identificada');
      this.installAndroid();
    }
    if (this.platform.is('ios')) {
      window.open('https://forecastappdev.wmccann.com/DataHubApp/DataHub.api');
    }
    console.log('Atualizacao Selecionada');
  }

  
  installAndroid() {
 
    const url = 'https://forecastappdev.wmccann.com/DataHubApp/DataHub-WMcCann.apk';

    this.fileTransfer.download(url, this.file.externalRootDirectory + 'download/DataHub-WMcCann.apk').then((entry) => {
      
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

  }
  
  showLogin() {
    let myModal = this.modalCtrl.create(LoginPage, {}, { enableBackdropDismiss:false });
    myModal.present();
  }
}
