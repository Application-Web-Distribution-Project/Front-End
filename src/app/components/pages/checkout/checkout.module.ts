import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [CheckoutComponent, ContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
