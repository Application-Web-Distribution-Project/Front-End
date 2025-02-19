import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactmapComponent } from './contactmap.component';

describe('ContactmapComponent', () => {
  let component: ContactmapComponent;
  let fixture: ComponentFixture<ContactmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
