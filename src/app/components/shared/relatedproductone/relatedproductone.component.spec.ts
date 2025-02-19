import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedproductoneComponent } from './relatedproductone.component';

describe('RelatedproductoneComponent', () => {
  let component: RelatedproductoneComponent;
  let fixture: ComponentFixture<RelatedproductoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedproductoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedproductoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
