import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogmasonryComponent } from './blogmasonry.component';

describe('BlogmasonryComponent', () => {
  let component: BlogmasonryComponent;
  let fixture: ComponentFixture<BlogmasonryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogmasonryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogmasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
