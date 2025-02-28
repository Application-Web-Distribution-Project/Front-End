import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { ReclamationFormComponent } from './reclamation-form/reclamation-form.component';
import { ReclamationDetailComponent } from './reclamation-detail/reclamation-detail.component';

const routes: Routes = [
  { path: '', component: ReclamationListComponent },  // ✅ Quand tu vas sur `/reclamations`
  { path: 'new', component: ReclamationFormComponent },  // `/reclamations/new`
  { path: ':id', component: ReclamationDetailComponent }  // `/reclamations/:id`
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclamationRoutingModule { }
