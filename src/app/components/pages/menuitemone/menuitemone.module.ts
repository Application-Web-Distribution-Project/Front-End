import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { MenuitemoneRoutingModule } from './menuitemone-routing.module';
import { MenuitemoneComponent } from './menuitemone.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [MenuitemoneComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    HttpClientModule,
    MenuitemoneRoutingModule
  ]
})
export class MenuitemoneModule { }
