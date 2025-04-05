import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';

@Component({
  selector: 'app-reclamation-detail',
  templateUrl: './reclamation-detail.component.html',
  styleUrls: ['./reclamation-detail.component.css']
})
export class ReclamationDetailComponent implements OnInit {
  reclamation: Reclamation | undefined;

  constructor(
    private route: ActivatedRoute,
    public reclamationService: ReclamationService  // Changed from private to public
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reclamationService.getReclamationById(+id).subscribe({
        next: (data) => {
          this.reclamation = data;
        },
        error: (error) => {
          console.error('Erreur API', error);
        }
      });
    }
  }

  updateStatus(newStatus: string): void {
    if (!this.reclamation) return;

    const comment = prompt('Ajouter un commentaire (optionnel):');
    
    this.reclamationService.updateReclamationStatus(this.reclamation.id, newStatus, comment || '')
      .subscribe({
        next: (updated) => {
          this.reclamation = updated;
          alert('Statut mis à jour avec succès!');
        },
        error: (error) => {
          console.error('Erreur mise à jour statut:', error);
          alert('Erreur lors de la mise à jour du statut');
        }
      });
  }
}
