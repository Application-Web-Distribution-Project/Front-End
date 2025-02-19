import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuitemoneComponent } from './menuitemone.component';

const routes: Routes = [{ path: '', component: MenuitemoneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuitemoneRoutingModule { }
