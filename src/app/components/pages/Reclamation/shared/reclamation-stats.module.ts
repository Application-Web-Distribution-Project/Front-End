import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReclamationStatsComponent } from '../reclamation-stats/reclamation-stats.component';

@NgModule({
  declarations: [ReclamationStatsComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ReclamationStatsComponent]
})
export class ReclamationStatsModule { }
