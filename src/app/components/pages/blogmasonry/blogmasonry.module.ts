import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMasonryGridModule } from 'ng-masonry-grid';

import { BlogmasonryRoutingModule } from './blogmasonry-routing.module';
import { BlogmasonryComponent } from './blogmasonry.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [BlogmasonryComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    NgxPaginationModule,
    NgMasonryGridModule,
    BlogmasonryRoutingModule
  ]
})
export class BlogmasonryModule { }
