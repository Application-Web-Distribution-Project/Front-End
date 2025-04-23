import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingComponentComponent } from './tracking-component.component';

describe('TrackingComponentComponent', () => {
  let component: TrackingComponentComponent;
  let fixture: ComponentFixture<TrackingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
