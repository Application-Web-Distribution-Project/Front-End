import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { ReclamationFormComponent } from './reclamation-form/reclamation-form.component';
import { ReclamationDetailComponent } from './reclamation-detail/reclamation-detail.component';
import { ReclamationStatsComponent } from './reclamation-stats/reclamation-stats.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: ReclamationListComponent },
  { path: 'new', component: ReclamationFormComponent },
  { path: 'stats', component: ReclamationStatsComponent },
  { path: ':id', component: ReclamationDetailComponent }
];

@NgModule({
  declarations: [
    ReclamationListComponent,
    ReclamationFormComponent,
    ReclamationDetailComponent,
    ReclamationStatsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ReclamationModule { }
