import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuoneComponent } from './menuone.component';

const routes: Routes = [{ path: '', component: MenuoneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuoneRoutingModule { }
