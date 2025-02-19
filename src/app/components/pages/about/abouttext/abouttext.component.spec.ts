import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbouttextComponent } from './abouttext.component';

describe('AbouttextComponent', () => {
  let component: AbouttextComponent;
  let fixture: ComponentFixture<AbouttextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbouttextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbouttextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
