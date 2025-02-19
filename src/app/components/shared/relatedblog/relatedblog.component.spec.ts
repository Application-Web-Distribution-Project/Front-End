import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedblogComponent } from './relatedblog.component';

describe('RelatedblogComponent', () => {
  let component: RelatedblogComponent;
  let fixture: ComponentFixture<RelatedblogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedblogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedblogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
