import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { ReclamationFormComponent } from './reclamation-form/reclamation-form.component';
import { ReclamationDetailComponent } from './reclamation-detail/reclamation-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { ReclamationRoutingModule } from './reclamation-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';





@NgModule({
  declarations: [
    ReclamationListComponent,
    ReclamationFormComponent,
    ReclamationDetailComponent,


  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    ReclamationRoutingModule,
    SlickCarouselModule //
],
  exports: [
    ReclamationListComponent,
    ReclamationFormComponent,
    ReclamationDetailComponent
  ]
})
export class ReclamationModule { }
