import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { MenuitemtwoRoutingModule } from './menuitemtwo-routing.module';
import { MenuitemtwoComponent } from './menuitemtwo.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [MenuitemtwoComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    HttpClientModule,
    MenuitemtwoRoutingModule
  ]
})
export class MenuitemtwoModule { }
