import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuitemtwoComponent } from './menuitemtwo.component';

const routes: Routes = [{ path: '', component: MenuitemtwoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuitemtwoRoutingModule { }
