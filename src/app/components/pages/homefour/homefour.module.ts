import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HomefourRoutingModule } from './homefour-routing.module';
import { HomefourComponent } from './homefour.component';

import { SharedModule } from '../../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { AboutComponent } from './about/about.component';
import { GalleryComponent } from './gallery/gallery.component';
import { BlogComponent } from './blog/blog.component';
import { ContactmapComponent } from './contactmap/contactmap.component';
import { RsmenuComponent } from './rsmenu/rsmenu.component';

@NgModule({
  declarations: [HomefourComponent, BannerComponent, AboutComponent, GalleryComponent, BlogComponent, ContactmapComponent, RsmenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    LeafletMarkerClusterModule,
    LeafletModule,
    NgbModule,
    HomefourRoutingModule
  ]
})
export class HomefourModule { }
