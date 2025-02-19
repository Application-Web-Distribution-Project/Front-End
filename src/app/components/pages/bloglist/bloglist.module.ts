import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { BloglistRoutingModule } from './bloglist-routing.module';
import { BloglistComponent } from './bloglist.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [BloglistComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    NgxPaginationModule,
    BloglistRoutingModule
  ]
})
export class BloglistModule { }
