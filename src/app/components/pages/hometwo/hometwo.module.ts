import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { HometwoRoutingModule } from './hometwo-routing.module';
import { HometwoComponent } from './hometwo.component';

import { SharedModule } from '../../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { OfferComponent } from './offer/offer.component';
import { ProcessComponent } from './process/process.component';
import { ProductsComponent } from './products/products.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';


@NgModule({
  declarations: [HometwoComponent, BannerComponent, CategoriesComponent, NewsletterComponent, OfferComponent, ProcessComponent, ProductsComponent, TestimonialsComponent],
  imports: [
    CommonModule,
    SharedModule,
    SlickCarouselModule,
    NgbModule,
    HometwoRoutingModule
  ]
})
export class HometwoModule { }
