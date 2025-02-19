import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsComponent } from './locations.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [LocationsComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    LeafletMarkerClusterModule,
    LeafletModule,
    LocationsRoutingModule
  ]
})
export class LocationsModule { }
