import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { HomethreeRoutingModule } from './homethree-routing.module';
import { HomethreeComponent } from './homethree.component';

import { SharedModule } from '../../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { MenucategoriesComponent } from './menucategories/menucategories.component';
import { InfographicsComponent } from './infographics/infographics.component';
import { OrderctaComponent } from './ordercta/ordercta.component';
import { ProcessComponent } from './process/process.component';
import { InstagramComponent } from './instagram/instagram.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

@NgModule({
  declarations: [HomethreeComponent, BannerComponent, MenucategoriesComponent, InfographicsComponent, OrderctaComponent, ProcessComponent, InstagramComponent, NewsletterComponent],
  imports: [
    CommonModule,
    SharedModule,
    SlickCarouselModule,
    NgbModule,
    HomethreeRoutingModule
  ]
})
export class HomethreeModule { }
