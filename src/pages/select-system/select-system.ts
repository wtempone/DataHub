import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, MenuController } from 'ionic-angular';
import { User } from "../../providers/user";
import { Client } from '../../providers/client';
import { System } from '../../providers/system';
import { TranslateService } from '@ngx-translate/core';
import { Ticket } from "../../providers/ticket";
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-select-system',
  templateUrl: 'select-system.html',
})
export class SelectSystemPage {
  loginErrorString: string;
  messageNothinSelected : string;
  systems: any;
  rows: any;
  systemInfo: any;
  inAppBrowserOptions: {
    location:'no',
    clearcache: 'yes',
    enableviewportscale:'yes',
    closebuttoncaption:'Fechar'
  }


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,    
    public user: User,
    public client: Client,
    public system: System,
    public ticket: Ticket,
    public translateService: TranslateService,
    public platform : Platform,
    public inAppBrowser : InAppBrowser,
    public menuCtrl: MenuController    
  ) {
    
    this.translateService.get(['SYSTEM_ERROR', 'SELECT_CLIENT']).subscribe((values) => {
      this.loginErrorString = values.SYSTEM_ERROR;
      this.messageNothinSelected = values.SELECT_CLIENT;
    })

    if (navParams.data.idCliente != null) {
      this.changeClient(navParams.data.idCliente,navParams.data.idUsuario);
    }
  }

    changeClient(idCliente,idUsuario) {
      this.systemInfo = { 
        idCliente: idCliente,
        idUsuario: idUsuario,
        dispositivo: 4 // Somente dispositivos móveis(Celulares e Tablets)
    }

    this.system.get(this.systemInfo).subscribe((resp) => {
      if (resp.statusText = 'OK'){        
        this.systems = this.system._systems;
        
        this.systems = this.systems.filter(obj => obj.MostraHub);

        for (let system of this.systems) {
          if (system.UsaMarca == 'true') {
            system.showDetails = false;
            system.icon = 'ios-add-circle-outline';            
          } 
        }

      } else {
        this.presentError();        
      }
    }, (err) => {
      this.presentError();
    });
  }

  launch(url) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        let browser = this.inAppBrowser.create(url, "_blank", this.inAppBrowserOptions);
        browser.show();
      } else {
        window.open(url, '_blank');
      }
    });
  }

  getTicket( mnemonic, marca ) {
    
    let ticketInfo = { 
      idUsuario: this.navParams.data.idUsuario, 
      mnemonic: mnemonic, 
      idCliente: this.navParams.data.idCliente, 
      marca: marca
    }

    this.ticket.get(ticketInfo).subscribe((resp) => {
      if (resp.statusText = 'OK'){
        if (this.ticket._ticket.indexOf('erro') < 0) {
          this.launch(this.ticket._ticket);
        } else {
          this.presentError();
          alert(this.ticket._ticket);
        }
      } else {
        this.presentError();        
      }
    }, (err) => {
      this.presentError();
    });
    
  }

  toggleDetails(system) {
    if (system.showDetails) {
        system.showDetails = false;
        system.icon = 'ios-add-circle-outline';
    } else {
        system.showDetails = true;
        system.icon = 'ios-remove-circle-outline';
    }
    for (let sys of this.systems) {
      if (sys.IdSistema != system.IdSistema) {
        sys.showDetails = false;
      }
    }    
  }

  messageLock(system) {
    this.translateService.get('ACCESS_SYSTEM_DENIED',{value: system.Nome}).subscribe((message) => {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })    
  }

  presentError() {
    let toast = this.toastCtrl.create({
      message: this.loginErrorString,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  ionViewDidLoad() {

  }

}