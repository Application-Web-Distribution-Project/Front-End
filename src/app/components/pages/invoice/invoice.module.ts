import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { InvoiceComponent } from './invoice.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    RouterModule.forChild([{ path: '', component: InvoiceComponent }]),
  ],
})
export class InvoiceModule {}
