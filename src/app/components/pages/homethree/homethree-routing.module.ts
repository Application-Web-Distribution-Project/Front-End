import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomethreeComponent } from './homethree.component';

const routes: Routes = [{ path: '', component: HomethreeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomethreeRoutingModule { }
