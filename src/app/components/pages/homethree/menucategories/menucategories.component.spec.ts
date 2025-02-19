import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenucategoriesComponent } from './menucategories.component';

describe('MenucategoriesComponent', () => {
  let component: MenucategoriesComponent;
  let fixture: ComponentFixture<MenucategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenucategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenucategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
