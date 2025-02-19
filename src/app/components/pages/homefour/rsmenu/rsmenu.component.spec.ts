import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsmenuComponent } from './rsmenu.component';

describe('RsmenuComponent', () => {
  let component: RsmenuComponent;
  let fixture: ComponentFixture<RsmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
