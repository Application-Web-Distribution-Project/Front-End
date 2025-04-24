import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'angular-crumbs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SharedModule } from './components/shared/shared.module';
import { MenuListComponent } from './components/pages/menu/menulist/menulist.component';
import { InvoiceModule } from './components/pages/invoice/invoice.module';
import { LivraisonListComponent } from './livraison-list/livraison-list.component';

@NgModule({
  declarations: [AppComponent, PreloaderComponent, MenuListComponent, LivraisonListComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    NgbModule,
    SharedModule,
    InvoiceModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
