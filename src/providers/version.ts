import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, ModalController, AlertController, Platform } from "ionic-angular";
import { AppVersion } from "@ionic-native/app-version";
import { URLs, Api } from "./api";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { File } from '@ionic-native/file';

@Injectable()
export class VersionProvider {
  private versionNumber: string;
  private fileTransfer: FileTransferObject;

  inAppBrowserOptions: {
    location: 'no',
    clearcache: 'yes',
    enableviewportscale: 'yes',
    closebuttoncaption: 'Fechar'
  };

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private appVersion: AppVersion,
    private api: Api,
    private platform: Platform,
    private transfer: FileTransfer,
    private file: File,
    private inAppBrowser: InAppBrowser,
    private http: Http
  ) { }

  serverVersion() {
    console.log('url:'+ URLs.ServerVersion);
    return this.http.get(URLs.ServerVersion, new RequestOptions());
  }

  versionChanged() {
    return this.platform.ready().then(() => {      
      console.log('platform is ready');
      return this.appVersion.getVersionNumber().then(versaoLocal => {
        console.log('app version is :'+versaoLocal);
        return this.serverVersion().map(serverV => {
          var serverVJson =  serverV.json()
          return serverVJson.versao != versaoLocal 
        })
      })
    })
  }
  
  showConfirmInstall() {
    this.serverVersion().map(server => server.json())
      .subscribe(server => {
        let confirm = this.alertCtrl.create({
          title: 'DataHub - Atualização obrigatória!',
          message: 'Uma nova versão (' + server.versao + ') do aplicativo está disponível para seu dispositivo. Deseja atualizar agora?',
          buttons: [
            {
              text: 'Cancelar',
              handler: () => {
                return;
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
      });
  }


  updateApp() {
    console.log(this.platform);
    console.log(this.platform);
    if (this.platform.is('android')) {
      this.installAndroid();
    }
    if (this.platform.is('ios')) {
      this.installIOS();
    }
    console.log('Atualizacao Selecionada');
  }


  installAndroid() {
    this.fileTransfer = this.transfer.create();
    const url = 'https://forecastappdev.wmccann.com/DataHubApp/DataHub.apk';
    console.log('Arquivos temporários:');
    console.log('externalApplicationStorageDirectory: ' + this.file.externalApplicationStorageDirectory);
    console.log('applicationStorageDirectory: ' + this.file.applicationStorageDirectory);
    console.log('cacheDirectory: ' + this.file.cacheDirectory);
    console.log('dataDirectory: ' + this.file.dataDirectory);
    console.log('documentsDirectory: ' + this.file.documentsDirectory);
    console.log('tempDirectory: ' + this.file.tempDirectory);
    this.fileTransfer.download(encodeURI(url), 'cdvfile://localhost/temporary/DataHub.apk').then((entry) => {

      console.log(entry.toURL());

      const options = {
        action: (<any>window).plugins.intentShim.ACTION_VIEW,
        url: entry.toURL(),
        type: 'application/vnd.android.package-archive'
      };

      (<any>window).plugins.intentShim.startActivity(options,
        function () { },
        function () { alert('Falha ao abrir URL via Android Intent') }
      );

    }, (error) => {
      let confirm = this.alertCtrl.create({
        title: 'DataHub',
        message: 'Não foi possível baixar a nova versão. Habilite o armazenamento de dados para o aplicativo. Para isso acesse no seu aparelho: "Configurar > Aplicativos > DataHub > Permissões" e habilite a permissão de "Armazenamento".',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              return;
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
}
