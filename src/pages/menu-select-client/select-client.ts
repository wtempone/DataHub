import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Nav, MenuController, AlertController } from 'ionic-angular';
import { User } from "../../providers/user";
import { Client } from '../../providers/client';
import { TranslateService } from '@ngx-translate/core';
import { SelectSystemPage } from "../select-system/select-system";
import { URLs } from "../../providers/api";
import { WelcomePage } from "../welcome/welcome";

@Component({
  selector: 'page-select-client',
  templateUrl: 'select-client.html',
})
export class SelectClientPage {
  clients: any;
  loginErrorString: string;
  @ViewChild(Nav) nav: Nav;
  rootPage: any = SelectSystemPage;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,    
    public user: User,
    public client: Client,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController        
  ) {
    
    this.translateService.get('CLIENT_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    let clientInfo = { 
      idUsuario: this.user._user.IdUsuario, 
      dispositivo: 4 // Somente dispositivos móveis(Celulares e Tablets)
     }

    this.client.get(clientInfo).subscribe((resp) => {
      if (resp.statusText == 'OK'){
        this.clients = this.client._clients;
        for (let client of this.clients) {
          if (client.CaminhoAppend != null) {
            if (client.CaminhoAppend.indexOf('~') >= 0 ) {
              //client.Picture = URLs.SCLSite + client.CaminhoAppend.replace('~','');
              client.Picture = null;
            } else {
              if (URLs.SCLSite) {
                client.Picture = URLs.SCLSite + '/Content/themes/logo-clientes/' + client.CaminhoAppend;
              } else {
                client.Picture = client.url.replace('https://','http://') + '/Content/themes/logo-clientes/' + client.CaminhoAppend;
              }
            }
          }
        }
        if (this.clients.length == 1) {
          this.openClient(this.clients[0]);
        } else {
          this.menuCtrl.open();          
        }
      } else {
        this.presentError();        
      }
    }, (err) => {
      this.presentError();
    });

  }

  openClient(client) {
    this.menuCtrl.close();
    for (let cli of this.clients) {
      if (cli.IdCliente == client.IdCliente) {
        cli.Selected = true;
      } else {
        cli.Selected = false;
      }
    }
    this.nav.setRoot(SelectSystemPage, {idCliente : client.IdCliente, idUsuario: this.user._user.IdUsuario, nome:client.Nome, picture: client.Picture })
  }

  presentError() {
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }

  logout(){
    this.translateService.get(['EXIT_CONFIRM_TITLE','EXIT_CONFIRM_MESSAGE', 'CANCEL_BUTTON', 'CONFIRM_BUTTON' ]).subscribe((values) => {
    let alert = this.alertCtrl.create({
      title: values.EXIT_CONFIRM_TITLE,
      message: values.EXIT_CONFIRM_MESSAGE,
      buttons: [
        {
          text: values.CANCEL_BUTTON,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: values.CONFIRM_BUTTON,
          handler: () => {
            this.navCtrl.setRoot(WelcomePage);
          }
        }
      ]
    });
    alert.present();
      
    })   
  }

  ionViewDidLoad() {

  }

}
