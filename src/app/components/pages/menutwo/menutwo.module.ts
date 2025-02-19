import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MenutwoRoutingModule } from './menutwo-routing.module';
import { MenutwoComponent } from './menutwo.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [MenutwoComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    MenutwoRoutingModule
  ]
})
export class MenutwoModule { }
