import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './about/about.component';
import { BannerComponent } from './banner/banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { CtaComponent } from './cta/cta.component';
import { InstagramComponent } from './instagram/instagram.component';
import { ProductsComponent } from './products/products.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';

@NgModule({
  declarations: [HomeComponent, AboutComponent, BannerComponent, CategoriesComponent, CtaComponent, InstagramComponent, ProductsComponent, TestimonialsComponent],
  imports: [
    CommonModule,
    SharedModule,
    SlickCarouselModule,
    NgbModule,
    HomeRoutingModule
  ],
  exports: [ProductsComponent, TestimonialsComponent]
})
export class HomeModule { }
