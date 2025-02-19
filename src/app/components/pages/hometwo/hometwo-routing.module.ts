import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HometwoComponent } from './hometwo.component';

const routes: Routes = [{ path: '', component: HometwoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HometwoRoutingModule { }
