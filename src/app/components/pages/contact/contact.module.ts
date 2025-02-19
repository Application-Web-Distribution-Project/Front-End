import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [ContactComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    LeafletMarkerClusterModule,
    LeafletModule,
    ContactRoutingModule
  ]
})
export class ContactModule { }
