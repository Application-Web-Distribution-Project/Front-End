import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMasonryGridModule } from 'ng-masonry-grid';

import { BlogfullRoutingModule } from './blogfull-routing.module';
import { BlogfullComponent } from './blogfull.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [BlogfullComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    NgMasonryGridModule,
    BlogfullRoutingModule
  ]
})
export class BlogfullModule { }
