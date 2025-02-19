import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    SharedModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
