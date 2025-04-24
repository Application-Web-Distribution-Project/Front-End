import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonListComponent } from './livraison-list.component';

describe('LivraisonListComponent', () => {
  let component: LivraisonListComponent;
  let fixture: ComponentFixture<LivraisonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivraisonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivraisonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
