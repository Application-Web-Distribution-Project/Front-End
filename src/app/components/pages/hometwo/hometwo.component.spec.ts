import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HometwoComponent } from './hometwo.component';

describe('HometwoComponent', () => {
  let component: HometwoComponent;
  let fixture: ComponentFixture<HometwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HometwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HometwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
