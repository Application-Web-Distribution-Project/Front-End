import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderinnerComponent } from './headerinner.component';

describe('HeaderinnerComponent', () => {
  let component: HeaderinnerComponent;
  let fixture: ComponentFixture<HeaderinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
