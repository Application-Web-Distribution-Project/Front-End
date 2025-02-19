import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomefourComponent } from './homefour.component';

const routes: Routes = [{ path: '', component: HomefourComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomefourRoutingModule { }
