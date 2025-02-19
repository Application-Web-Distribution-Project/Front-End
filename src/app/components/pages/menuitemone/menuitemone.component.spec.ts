import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuitemoneComponent } from './menuitemone.component';

describe('MenuitemoneComponent', () => {
  let component: MenuitemoneComponent;
  let fixture: ComponentFixture<MenuitemoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuitemoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuitemoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
