import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogmasonryComponent } from './blogmasonry.component';

const routes: Routes = [{ path: '', component: BlogmasonryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogmasonryRoutingModule { }
