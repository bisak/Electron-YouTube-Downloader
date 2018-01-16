import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgxElectronModule } from 'ngx-electron';

import { CustomMaterializeModule } from './modules/custom-materialize/custom-materialize.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainDlLinkFormComponent } from './components/main-dl-link-form/main-dl-link-form.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { VideoListItemComponent } from './components/video-list-item/video-list-item.component'
import { HelperService } from './services/helper.service';
import { VideoInfoFetchSpinnerComponent } from './components/video-info-fetch-spinner/video-info-fetch-spinner.component';
import { CommunicationService } from './services/communication.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainDlLinkFormComponent,
    MainPageComponent,
    VideoListComponent,
    VideoListItemComponent,
    VideoInfoFetchSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    CustomMaterializeModule,
    FormsModule
  ],
  providers: [
    HelperService,
    CommunicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
