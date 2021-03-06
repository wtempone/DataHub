import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { WelcomePage } from '../pages/welcome/welcome';
import { SelectClientPage } from "../pages/menu-select-client/select-client";

import { Api } from '../providers/api';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { Client } from "../providers/client";
import { System } from "../providers/system";
import { Ticket } from "../providers/ticket";

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectSystemPage } from "../pages/select-system/select-system";
import { FlashCardComponent } from '../components/flash-card/flash-card';
import { AppVersion } from '@ionic-native/app-version';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { VersionProvider } from '../providers/version';

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {

  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SettingsPage,
    WelcomePage,
    SelectClientPage,
    SelectSystemPage,
    FlashCardComponent    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    WelcomePage,
    SelectClientPage,
    SelectSystemPage        
  ],
  providers: [
    Api,
    Items,
    User,
    Client,
    System,
    Ticket,
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    InAppBrowser,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppVersion,
    FileTransfer, FileTransferObject,
    File,
    VersionProvider
  ]
})
export class AppModule { }
