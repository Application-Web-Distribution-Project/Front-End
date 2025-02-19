import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderfourComponent } from './headerfour.component';

describe('HeaderfourComponent', () => {
  let component: HeaderfourComponent;
  let fixture: ComponentFixture<HeaderfourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderfourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderfourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
