import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilemenuComponent } from './mobilemenu.component';

describe('MobilemenuComponent', () => {
  let component: MobilemenuComponent;
  let fixture: ComponentFixture<MobilemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilemenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
