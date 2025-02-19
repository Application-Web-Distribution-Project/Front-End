import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenutwoComponent } from './menutwo.component';

describe('MenutwoComponent', () => {
  let component: MenutwoComponent;
  let fixture: ComponentFixture<MenutwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenutwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenutwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
