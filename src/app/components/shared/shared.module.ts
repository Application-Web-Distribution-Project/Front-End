import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'angular-crumbs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { BlogsidebarComponent } from './blogsidebar/blogsidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CartlistComponent } from './cartlist/cartlist.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HeadertwoComponent } from './headertwo/headertwo.component';
import { HeaderthreeComponent } from './headerthree/headerthree.component';
import { HeaderfourComponent } from './headerfour/headerfour.component';
import { HeaderinnerComponent } from './headerinner/headerinner.component';
import { MenuComponent } from './menu/menu.component';
import { MobilemenuComponent } from './mobilemenu/mobilemenu.component';
import { QuickviewComponent } from './quickview/quickview.component';
import { RelatedblogComponent } from './relatedblog/relatedblog.component';
import { RelatedproductComponent } from './relatedproduct/relatedproduct.component';
import { RelatedproductoneComponent } from './relatedproductone/relatedproductone.component';
import { SearchComponent } from './search/search.component';



@NgModule({
  declarations: [BlogsidebarComponent, BreadcrumbComponent, CartlistComponent, FooterComponent, HeaderComponent, HeadertwoComponent, HeaderthreeComponent, HeaderfourComponent, HeaderinnerComponent, MenuComponent, MobilemenuComponent, QuickviewComponent, RelatedblogComponent, RelatedproductComponent, RelatedproductoneComponent, SearchComponent],
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    NgbModule,
    BreadcrumbModule,
    HttpClientModule,
    PerfectScrollbarModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports:[BlogsidebarComponent, BreadcrumbComponent, CartlistComponent, FooterComponent, HeaderComponent, HeadertwoComponent, HeaderthreeComponent, HeaderfourComponent, HeaderinnerComponent, MenuComponent, MobilemenuComponent, QuickviewComponent, RelatedblogComponent, RelatedproductComponent, RelatedproductoneComponent, SearchComponent]
})
export class SharedModule { }
