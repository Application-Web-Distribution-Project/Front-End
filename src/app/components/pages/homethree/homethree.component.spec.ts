import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomethreeComponent } from './homethree.component';

describe('HomethreeComponent', () => {
  let component: HomethreeComponent;
  let fixture: ComponentFixture<HomethreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomethreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomethreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
