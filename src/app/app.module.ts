import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';  // ✅ Ajouté pour HTTP requests
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'angular-crumbs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './preloader/preloader.component';




@NgModule({
  declarations: [
    AppComponent,

    PreloaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,  // ✅ Ajouté pour gérer les appels API
    AppRoutingModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ⚠️ Garde uniquement si nécessaire pour Web Components
})
export class AppModule { }
