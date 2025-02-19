import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderctaComponent } from './ordercta.component';

describe('OrderctaComponent', () => {
  let component: OrderctaComponent;
  let fixture: ComponentFixture<OrderctaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderctaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderctaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
