import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { MenuoneRoutingModule } from './menuone-routing.module';
import { MenuoneComponent } from './menuone.component';

import { SharedModule } from '../../shared/shared.module';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [MenuoneComponent, ItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    SlickCarouselModule,
    NgbModule,
    MenuoneRoutingModule
  ]
})
export class MenuoneModule { }
