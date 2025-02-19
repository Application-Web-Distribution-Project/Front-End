import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { BlogsingleRoutingModule } from './blogsingle-routing.module';
import { BlogsingleComponent } from './blogsingle.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [BlogsingleComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    HttpClientModule,
    BlogsingleRoutingModule
  ]
})
export class BlogsingleModule { }
