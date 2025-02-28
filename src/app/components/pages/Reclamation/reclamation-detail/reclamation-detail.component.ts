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
    private reclamationService: ReclamationService
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
}
