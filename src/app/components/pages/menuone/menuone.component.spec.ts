import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuoneComponent } from './menuone.component';

describe('MenuoneComponent', () => {
  let component: MenuoneComponent;
  let fixture: ComponentFixture<MenuoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
