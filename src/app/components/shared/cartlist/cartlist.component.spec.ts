import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartlistComponent } from './cartlist.component';

describe('CartlistComponent', () => {
  let component: CartlistComponent;
  let fixture: ComponentFixture<CartlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
