import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommandesRoutingModule } from './commandes-routing.module';
import { CommandesComponent } from './commandes.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CommandesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgbModule,
    CommandesRoutingModule
  ]
})
export class CommandesModule { }