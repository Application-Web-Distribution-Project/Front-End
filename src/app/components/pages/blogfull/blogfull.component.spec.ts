import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogfullComponent } from './blogfull.component';

describe('BlogfullComponent', () => {
  let component: BlogfullComponent;
  let fixture: ComponentFixture<BlogfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogfullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
