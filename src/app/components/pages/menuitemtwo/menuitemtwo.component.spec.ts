import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuitemtwoComponent } from './menuitemtwo.component';

describe('MenuitemtwoComponent', () => {
  let component: MenuitemtwoComponent;
  let fixture: ComponentFixture<MenuitemtwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuitemtwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuitemtwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
