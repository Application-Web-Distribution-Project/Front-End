import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenutwoComponent } from './menutwo.component';

const routes: Routes = [{ path: '', component: MenutwoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenutwoRoutingModule { }
