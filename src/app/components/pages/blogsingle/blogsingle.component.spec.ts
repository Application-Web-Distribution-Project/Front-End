import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsingleComponent } from './blogsingle.component';

describe('BlogsingleComponent', () => {
  let component: BlogsingleComponent;
  let fixture: ComponentFixture<BlogsingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
