import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BloglistComponent } from './bloglist.component';

const routes: Routes = [{ path: '', component: BloglistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloglistRoutingModule { }
